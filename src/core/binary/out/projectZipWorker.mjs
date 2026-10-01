// Packs the project archive by STREAMING it to a temp file, running in a
// worker thread spawned by projectZip.ts. Neither the per-file stat/deflate
// CPU work nor any archive-sized allocation ever touches the Core event
// loop or memory: each file is read, deflated and written in bounded
// (default ~64 KiB) chunks, and the finished archive lives on disk only.
//
// IMPORTANT: this file must import ONLY Node builtins. It is shipped as a
// loose .mjs asset copied next to every bundled Core (VS Code extension,
// pkg binary — see the llama tokenizer worker copy lists), where npm
// resolution is not guaranteed. That is also why it uses raw worker_threads
// rather than the workerpool package the tokenizer workers use.
//
// Protocol (parentPort messages):
//   { type: "progress", filesDone, totalFiles }  after each packed file
//   { type: "done", result }                      { zipBytes, fileCount, ... }
//   { type: "error", message }                    fatal — parent deletes the partial file

import * as fs from "node:fs";
import * as path from "node:path";
import { once } from "node:events";
import { Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import * as zlib from "node:zlib";
import { parentPort, workerData } from "node:worker_threads";

const LOCAL_HEADER_SIG = 0x04034b50; // PK\x03\x04
const DATA_DESCRIPTOR_SIG = 0x08074b50; // PK\x07\x08
const CENTRAL_HEADER_SIG = 0x02014b50; // PK\x01\x02
const EOCD_SIG = 0x06054b50; // PK\x05\x06

/**
 * The EOCD and central-directory entry counts are 16-bit fields and this
 * writer has no ZIP64 support, so an archive can hold at most 65,535
 * entries. Once the budget is spent the packing loop stops adding files
 * and marks the archive truncated — the same behavior as the size cap —
 * instead of overflowing the EOCD count.
 */
const MAX_ZIP_ENTRIES = 0xffff;

/**
 * Sentinel error code: an entry's actual bytes exceeded the remaining
 * archive budget while it was being read (the file grew in flight past
 * what its stat size promised) — the entry is rolled back out and the
 * archive is marked truncated.
 */
const CAP_EXCEEDED = "gamecowork-cap-exceeded";

const METHOD_DEFLATE = 8;
const VERSION = 20; // 2.0 — deflate needs nothing newer; archive is < 4 GiB
// bit 3: crc/sizes follow in a data descriptor (unknown before streaming),
// bit 11: entry names are UTF-8
const FLAGS = 0x0808;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function makeCrc32() {
  let running = 0xffffffff;
  return {
    update(buf) {
      let c = running;
      for (let i = 0; i < buf.length; i++) {
        c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
      }
      running = c;
    },
    final() {
      return (running ^ 0xffffffff) >>> 0;
    },
  };
}

/** ZIP timestamps are DOS 16-bit time + date fields. */
function dosDateTime(mtimeMs) {
  const d = new Date(mtimeMs);
  const time =
    (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  const year = Math.max(1980, d.getFullYear());
  const date = ((year - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time, date };
}

function localFileHeader(nameBuf, time, date) {
  const buf = Buffer.alloc(30);
  buf.writeUInt32LE(LOCAL_HEADER_SIG, 0);
  buf.writeUInt16LE(VERSION, 4);
  buf.writeUInt16LE(FLAGS, 6);
  buf.writeUInt16LE(METHOD_DEFLATE, 8);
  buf.writeUInt16LE(time, 10);
  buf.writeUInt16LE(date, 12);
  // crc/compressed/uncompressed sizes: 0 — real values follow in the
  // data descriptor (flag bit 3)
  buf.writeUInt16LE(nameBuf.length, 26);
  return buf;
}

function dataDescriptor(crc, compressedSize, uncompressedSize) {
  const buf = Buffer.alloc(16);
  buf.writeUInt32LE(DATA_DESCRIPTOR_SIG, 0);
  buf.writeUInt32LE(crc, 4);
  buf.writeUInt32LE(compressedSize, 8);
  buf.writeUInt32LE(uncompressedSize, 12);
  return buf;
}

function centralHeader(entry) {
  const buf = Buffer.alloc(46);
  buf.writeUInt32LE(CENTRAL_HEADER_SIG, 0);
  buf.writeUInt16LE(VERSION, 4); // version made by
  buf.writeUInt16LE(VERSION, 6); // version needed
  buf.writeUInt16LE(FLAGS, 8);
  buf.writeUInt16LE(METHOD_DEFLATE, 10);
  buf.writeUInt16LE(entry.time, 12);
  buf.writeUInt16LE(entry.date, 14);
  buf.writeUInt32LE(entry.crc, 16);
  buf.writeUInt32LE(entry.compressedSize, 20);
  buf.writeUInt32LE(entry.uncompressedSize, 24);
  buf.writeUInt16LE(entry.nameBuf.length, 28);
  // extra/comment lengths, disk number, internal attrs: 0
  buf.writeUInt32LE(entry.localOffset, 42);
  return buf;
}

function endOfCentralDirectory(entryCount, centralSize, centralOffset) {
  const buf = Buffer.alloc(22);
  buf.writeUInt32LE(EOCD_SIG, 0);
  buf.writeUInt16LE(entryCount, 8);
  buf.writeUInt16LE(entryCount, 10);
  buf.writeUInt32LE(centralSize, 12);
  buf.writeUInt32LE(centralOffset, 16);
  return buf;
}

/**
 * Archive-under-construction. `offset` is the running byte position — the
 * single source of truth for header offsets and for rolling back a failed
 * entry.
 */
function createArchive(outputPath) {
  const state = {
    out: fs.createWriteStream(outputPath, { flags: "w" }),
    offset: 0,
    entries: [],
  };

  async function write(buf) {
    state.offset += buf.length;
    if (!state.out.write(buf)) {
      await once(state.out, "drain");
    }
  }

  /**
   * A file that fails mid-entry (after its local header was written) must
   * not leave half an entry behind — that would corrupt the archive. Rewind
   * the output to the entry's start offset and keep packing.
   */
  async function rollbackTo(entryStart) {
    const old = state.out;
    old.on("error", () => {}); // swallow destroy-time flush errors
    // The old stream may already be destroyed (e.g. the failure WAS an
    // archive-stream error, whose 'close' has already fired) — waiting
    // for 'close' then would hang forever.
    if (!old.destroyed) {
      const closed = once(old, "close");
      old.destroy();
      await closed.catch(() => {});
    }
    await fs.promises.truncate(outputPath, entryStart);
    state.out = fs.createWriteStream(outputPath, {
      flags: "r+",
      start: entryStart,
    });
    state.offset = entryStart;
  }

  /** Append one entry; `source` produces the raw content via onRawChunk/sink.
   * `maxUncompressedBytes` (optional) bounds the entry's raw byte count —
   * the stream aborts with a CAP_EXCEEDED error as soon as it is known
   * to exceed the budget, so a file that grows mid-read cannot push the
   * archive past the size cap. */
  async function addEntry(entryName, source, maxUncompressedBytes) {
    const nameBuf = Buffer.from(entryName, "utf8");
    const localOffset = state.offset;
    const { time, date } = dosDateTime(source.mtimeMs);
    await write(localFileHeader(nameBuf, time, date));
    await write(nameBuf);

    const crc = makeCrc32();
    let uncompressedSize = 0;
    let compressedSize = 0;
    // Bridge the deflate output into the archive stream with backpressure
    // (chunked straight through; nothing entry-sized is buffered).
    const intoArchive = new Writable({
      write(chunk, _enc, callback) {
        compressedSize += chunk.length;
        state.offset += chunk.length;
        if (state.out.write(chunk)) {
          callback();
          return;
        }
        // Forward an archive-stream failure instead of waiting forever
        // for a drain that will never come (e.g. disk full).
        const onDrain = () => {
          cleanup();
          callback();
        };
        const onError = (err) => {
          cleanup();
          callback(err);
        };
        const cleanup = () => {
          state.out.off("drain", onDrain);
          state.out.off("error", onError);
        };
        state.out.once("drain", onDrain);
        state.out.once("error", onError);
      },
    });

    await source.run(
      (chunk) => {
        crc.update(chunk);
        uncompressedSize += chunk.length;
        if (
          maxUncompressedBytes !== undefined &&
          uncompressedSize > maxUncompressedBytes
        ) {
          throw Object.assign(
            new Error(
              `entry exceeded the remaining archive budget of ${maxUncompressedBytes} bytes (file grew mid-read?)`,
            ),
            { code: CAP_EXCEEDED },
          );
        }
      },
      intoArchive,
    );

    const finalCrc = crc.final();
    await write(dataDescriptor(finalCrc, compressedSize, uncompressedSize));
    state.entries.push({
      nameBuf,
      time,
      date,
      crc: finalCrc,
      compressedSize,
      uncompressedSize,
      localOffset,
    });
    return uncompressedSize;
  }

  async function addFileFromDisk(absPath, entryName, maxUncompressedBytes) {
    const st = await fs.promises.stat(absPath);
    const src = fs.createReadStream(absPath);
    // Await the open so an unreadable file fails BEFORE any header bytes
    // are written (the common skip case needs no rollback).
    await once(src, "open");
    try {
      return await addEntry(
        entryName,
        {
          mtimeMs: st.mtimeMs,
          run: async (onRawChunk, sink) => {
            const countRaw = new Transform({
              transform(chunk, _enc, callback) {
                // A throw inside _transform does not reliably reject the
                // pipeline promise — route it through the callback so
                // budget/cap errors travel the normal stream-error path.
                try {
                  onRawChunk(chunk);
                } catch (err) {
                  callback(err);
                  return;
                }
                callback(null, chunk);
              },
            });
            await pipeline(src, countRaw, zlib.createDeflateRaw(), sink);
          },
        },
        maxUncompressedBytes,
      );
    } catch (err) {
      // pipeline destroys src on failure; a pre-pipeline failure leaves
      // the open fd to the caller — release it now
      src.destroy();
      throw err;
    }
  }

  async function addBuffer(entryName, content) {
    return addEntry(entryName, {
      mtimeMs: Date.now(),
      run: async (onRawChunk, sink) => {
        onRawChunk(content);
        const compressed = await new Promise((resolve, reject) =>
          zlib.deflateRaw(content, (err, data) =>
            err ? reject(err) : resolve(data),
          ),
        );
        await pipeline(
          async function* () {
            yield compressed;
          }(),
          sink,
        );
      },
    });
  }

  async function finish() {
    const centralOffset = state.offset;
    for (const entry of state.entries) {
      await write(centralHeader(entry));
      await write(entry.nameBuf);
    }
    const centralSize = state.offset - centralOffset;
    await write(endOfCentralDirectory(state.entries.length, centralSize, centralOffset));
    state.out.end();
    await once(state.out, "finish");
    return state.offset;
  }

  return { state, write, rollbackTo, addFileFromDisk, addBuffer, finish };
}

async function run() {
  const {
    projectRoot,
    relPaths,
    maxTotalBytes,
    maxEntries: maxEntriesOpt,
    outputPath,
    infoEntryName,
    infoRules,
    skippedSymlinks,
    addInfoEntry,
  } = workerData;

  const archive = createArchive(outputPath);
  const totalFiles = relPaths.length;
  let fileCount = 0;
  let totalBytes = 0;
  let truncated = false;
  let skippedFilesForCap = 0;

  // Entry budget for the whole archive (files + the info entry below).
  // maxFileEntries leaves one slot for the info entry when it will be
  // written, so the 16-bit EOCD count can never overflow at finish().
  const maxEntries = maxEntriesOpt ?? MAX_ZIP_ENTRIES;
  const maxFileEntries = maxEntries - (addInfoEntry ? 1 : 0);

  for (const relPath of relPaths) {
    if (truncated) {
      skippedFilesForCap++;
      continue;
    }
    if (archive.state.entries.length >= maxFileEntries) {
      truncated = true;
      skippedFilesForCap++;
      continue;
    }
    const absPath = path.join(projectRoot, relPath);
    let size;
    try {
      size = (await fs.promises.stat(absPath)).size;
    } catch {
      continue; // vanished between the collection pass and now
    }
    if (totalBytes + size > maxTotalBytes) {
      truncated = true;
      skippedFilesForCap++;
      continue;
    }
    const entryStart = archive.state.offset;
    try {
      // The stat-size check above is only a fast path: the file may
      // grow while it is being read, so the real bound on packed bytes
      // is enforced DURING the read against the remaining budget —
      // an over-budget entry aborts, rolls back and truncates here.
      const actualSize = await archive.addFileFromDisk(
        absPath,
        relPath,
        maxTotalBytes - totalBytes,
      );
      totalBytes += actualSize;
      fileCount++;
      parentPort.postMessage({
        type: "progress",
        filesDone: fileCount,
        totalFiles,
      });
    } catch (err) {
      if (archive.state.offset !== entryStart) {
        await archive.rollbackTo(entryStart);
      }
      if (err && err.code === CAP_EXCEEDED) {
        truncated = true;
        skippedFilesForCap++;
        continue;
      }
      console.warn(
        `[projectZip] Failed to read file ${absPath}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // Provenance/stats entry, skipped when the project already has one.
  // The budget guard keeps the EOCD count within maxEntries for every
  // input, including degenerate budgets that leave no room at all.
  if (addInfoEntry && archive.state.entries.length < maxEntries) {
    await archive.addBuffer(
      infoEntryName,
      Buffer.from(
        JSON.stringify(
          {
            created_at: new Date().toISOString(),
            // Only the directory name — the archive must not leak the
            // local absolute path (username, directory layout).
            project_name: path.basename(projectRoot),
            rules: infoRules,
            file_count: fileCount,
            total_bytes: totalBytes,
            max_total_bytes: maxTotalBytes,
            truncated,
            skipped_files_for_cap: skippedFilesForCap,
            skipped_symlinks: skippedSymlinks,
          },
          null,
          2,
        ),
        "utf8",
      ),
    );
  }

  const zipBytes = await archive.finish();
  parentPort.postMessage({
    type: "done",
    result: {
      zipBytes,
      fileCount,
      totalBytes,
      truncated,
      skippedFilesForCap,
    },
  });
}

run().catch((err) => {
  parentPort.postMessage({
    type: "error",
    message: err instanceof Error ? err.message : String(err),
  });
});
