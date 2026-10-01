(function(process, require, console, EXECPATH_FD, PAYLOAD_POSITION, PAYLOAD_SIZE) { return (function (REQUIRE_COMMON, VIRTUAL_FILESYSTEM, DEFAULT_ENTRYPOINT, SYMLINKS, DICT, DOCOMPRESS) {
        /* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */

/* global EXECPATH_FD */
/* global PAYLOAD_POSITION */
/* global PAYLOAD_SIZE */
/* global REQUIRE_COMMON */
/* global VIRTUAL_FILESYSTEM */
/* global DEFAULT_ENTRYPOINT */
/* global DICT */
/* global DOCOMPRESS */
/* global SYMLINKS */

'use strict';

const childProcess = require('child_process');
const { createHash } = require('crypto');
const fs = require('fs');
const { isRegExp } = require('util').types;
const Module = require('module');
const path = require('path');
const { promisify, _extend } = require('util');
const { Script } = require('vm');
const { tmpdir } = require('os');
const util = require('util');
const {
  brotliDecompress,
  brotliDecompressSync,
  gunzip,
  gunzipSync,
} = require('zlib');

const common = {};
REQUIRE_COMMON(common);

const {
  STORE_BLOB,
  STORE_CONTENT,
  STORE_LINKS,
  STORE_STAT,
  isRootPath,
  normalizePath,
  insideSnapshot,
  stripSnapshot,
  removeUplevels,
} = common;

let FLAG_ENABLE_PROJECT = false;
const NODE_VERSION_MAJOR = process.version.match(/^v(\d+)/)[1] | 0;
const NODE_VERSION_MINOR = process.version.match(/^v\d+.(\d+)/)[1] | 0;

// /////////////////////////////////////////////////////////////////
// ENTRYPOINT //////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

// set ENTRYPOINT and ARGV0 here because
// they can be altered during process run
const ARGV0 = process.argv[0];
const EXECPATH = process.execPath;
let ENTRYPOINT = process.argv[1];

if (process.env.PKG_EXECPATH === 'PKG_INVOKE_NODEJS') {
  return { undoPatch: true };
}

if (NODE_VERSION_MAJOR < 12 || require('worker_threads').isMainThread) {
  if (process.argv[1] !== 'PKG_DUMMY_ENTRYPOINT') {
    // expand once patchless is introduced, that
    // will obviously lack any work in node_main.cc
    throw new Error('PKG_DUMMY_ENTRYPOINT EXPECTED');
  }
}

if (process.env.PKG_EXECPATH === EXECPATH) {
  process.argv.splice(1, 1);

  if (process.argv[1] && process.argv[1] !== '-') {
    // https://github.com/nodejs/node/blob/1a96d83a223ff9f05f7d942fb84440d323f7b596/lib/internal/bootstrap/node.js#L269
    process.argv[1] = path.resolve(process.argv[1]);
  }
} else {
  process.argv[1] = DEFAULT_ENTRYPOINT;
}

[, ENTRYPOINT] = process.argv;
delete process.env.PKG_EXECPATH;

// /////////////////////////////////////////////////////////////////
// EXECSTAT ////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

const EXECSTAT = fs.statSync(EXECPATH);

EXECSTAT.atimeMs = EXECSTAT.atime.getTime();
EXECSTAT.mtimeMs = EXECSTAT.mtime.getTime();
EXECSTAT.ctimeMs = EXECSTAT.ctime.getTime();
EXECSTAT.birthtimeMs = EXECSTAT.birthtime.getTime();

// /////////////////////////////////////////////////////////////////
// MOUNTPOINTS /////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

const mountpoints = [];

function insideMountpoint(f) {
  if (!insideSnapshot(f)) return null;
  const file = normalizePath(f);
  const found = mountpoints
    .map((mountpoint) => {
      const { interior, exterior } = mountpoint;
      if (isRegExp(interior) && interior.test(file))
        return file.replace(interior, exterior);
      if (interior === file) return exterior;
      const left = interior + path.sep;
      if (file.slice(0, left.length) !== left) return null;
      return exterior + file.slice(left.length - 1);
    })
    .filter((result) => result);

  if (found.length >= 2) throw new Error('UNEXPECTED-00');
  if (found.length === 0) return null;
  return found[0];
}

function readdirMountpoints(path_) {
  return mountpoints
    .filter(({ interior }) => {
      if (isRegExp(interior)) return interior.test(path_);
      return path.dirname(interior) === path_;
    })
    .map(({ interior, exterior }) => {
      if (isRegExp(interior)) return path_.replace(interior, exterior);
      return path.basename(interior);
    });
}

function translate(f) {
  const result = insideMountpoint(f);
  if (!result) throw new Error('UNEXPECTED-05');
  return result;
}

function cloneArgs(args_) {
  return Array.prototype.slice.call(args_);
}

function translateNth(args_, index, f) {
  const args = cloneArgs(args_);
  args[index] = translate(f);
  return args;
}

function createMountpoint(interior, exterior) {
  // TODO validate
  mountpoints.push({ interior, exterior });
}

const DEFAULT_COPY_CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB
function copyInChunks(
  source,
  target,
  chunkSize = DEFAULT_COPY_CHUNK_SIZE,
  fs_ = fs
) {
  const sourceFile = fs_.openSync(source, 'r');
  const targetFile = fs_.openSync(target, 'w');

  let bytesRead = 1;
  while (bytesRead > 0) {
    const buffer = Buffer.alloc(chunkSize);
    bytesRead = fs_.readSync(sourceFile, buffer, 0, chunkSize);
    fs_.writeSync(targetFile, buffer, 0, bytesRead);
  }

  fs_.closeSync(sourceFile);
  fs_.closeSync(targetFile);
}

// TODO: replace this with fs.cpSync when we drop Node < 16
function copyFolderRecursiveSync(source, target) {
  // Build target folder
  const targetFolder = path.join(target, path.basename(source));

  // Check if target folder needs to be created or integrated
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);

    for (const file of files) {
      // Build source name
      const curSource = path.join(source, file);

      // Call this function recursively as long as source is a directory
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        // Current source is a file, it must be available on the real filesystem
        // instead of the virtual snapshot file system to load it by process.dlopen.
        //
        // Before we try to copy we do some checks.
        // See https://github.com/vercel/pkg/issues/1589 for more details.

        // Build target file name
        const curTarget = path.join(targetFolder, path.basename(curSource));

        if (fs.existsSync(curTarget)) {
          // Target file already exists, read source and target file...
          const curSourceContent = fs.readFileSync(curSource, {
            encoding: 'binary',
          });
          const curTargetContent = fs.readFileSync(curTarget, {
            encoding: 'binary',
          });

          // ...and calculate checksum from source and target file
          const curSourceHash = createHash('sha256')
            .update(curSourceContent)
            .digest('hex');
          const curTargetHash = createHash('sha256')
            .update(curTargetContent)
            .digest('hex');

          // If checksums are equal then there is nothing to do here
          // ==> target already exists and is up-to-date
          if (curSourceHash === curTargetHash) {
            continue;
          }
        }

        // Target must be copied because it either does not exist or is outdated.
        // Due to the possibility that mutliple instances of this app start simultaneously,
        // the copy action might fail. Only one starting instance gets write access.
        //
        // We don't catch any error here because it does not make sense to go ahead and to
        // try to load the file while another instance has not yet finished the copy action.
        // If the app start fails then the user should try to start the app later again.
        // Unfortunately, we cannot implement delayed retries ourselves because process.dlopen
        // is a synchronous function, promises are not supported.
        fs.copyFileSync(curSource, curTarget);
      }
    }
  }
}

function createDirRecursively(dir) {
  if (!fs.existsSync(dir)) {
    createDirRecursively(path.join(dir, '..'));
    fs.mkdirSync(dir);
  }
}

/*

// TODO move to some test

createMountpoint("d:\\snapshot\\countly\\plugins-ext", "d:\\deploy\\countly\\v16.02\\plugins-ext");

console.log(insideMountpoint("d:\\snapshot"));
console.log(insideMountpoint("d:\\snapshot\\"));
console.log(insideMountpoint("d:\\snapshot\\countly"));
console.log(insideMountpoint("d:\\snapshot\\countly\\"));
console.log(insideMountpoint("d:\\snapshot\\countly\\plugins-ext"));
console.log(insideMountpoint("d:\\snapshot\\countly\\plugins-ext\\"));
console.log(insideMountpoint("d:\\snapshot\\countly\\plugins-ext\\1234"));

console.log(translate("d:\\snapshot\\countly\\plugins-ext"));
console.log(translate("d:\\snapshot\\countly\\plugins-ext\\"));
console.log(translate("d:\\snapshot\\countly\\plugins-ext\\1234"));

console.log(translateNth([], 0, "d:\\snapshot\\countly\\plugins-ext"));
console.log(translateNth([], 0, "d:\\snapshot\\countly\\plugins-ext\\"));
console.log(translateNth([], 0, "d:\\snapshot\\countly\\plugins-ext\\1234"));

console.log(translateNth(["", "r+"], 0, "d:\\snapshot\\countly\\plugins-ext"));
console.log(translateNth(["", "rw"], 0, "d:\\snapshot\\countly\\plugins-ext\\"));
console.log(translateNth(["", "a+"], 0, "d:\\snapshot\\countly\\plugins-ext\\1234"));
*/
const dictRev = {};
const separator = '/';
let maxKey = Object.values(DICT).length;

function replace(k) {
  let v = DICT[k];
  // we have found a part of a missing file => let record for latter use
  if (v === undefined) {
    maxKey += 1;
    v = maxKey.toString(36);
    DICT[k] = v;
    dictRev[v] = k;
  }
  return v;
}

function findVirtualFileSystemKey(path_, slash) {
  const normalizedPath = normalizePath(path_);
  if (!DOCOMPRESS) {
    return normalizedPath;
  }
  const a = normalizedPath.split(slash).map(replace).join(separator);
  return a || normalizedPath;
}

Object.entries(DICT).forEach(([k, v]) => {
  dictRev[v] = k;
});

function toOriginal(fShort) {
  if (!DOCOMPRESS) {
    return fShort;
  }
  return fShort
    .split(separator)
    .map((x) => dictRev[x])
    .join(path.sep);
}

const symlinksEntries = Object.entries(SYMLINKS);

// separator for substitution depends on platform;
const sepsep = DOCOMPRESS ? separator : path.sep;

function findVirtualFileSystemKeyAndFollowLinks(path_) {
  let vfsKey = findVirtualFileSystemKey(path_, path.sep);
  let needToSubstitute = true;
  while (needToSubstitute) {
    needToSubstitute = false;
    for (const [k, v] of symlinksEntries) {
      if (vfsKey.startsWith(`${k}${sepsep}`) || vfsKey === k) {
        vfsKey = vfsKey.replace(k, v);
        needToSubstitute = true;
        break;
      }
    }
  }
  return vfsKey;
}

function realpathFromSnapshot(path_) {
  const realPath = toOriginal(findVirtualFileSystemKeyAndFollowLinks(path_));
  return realPath;
}

function findVirtualFileSystemEntry(path_) {
  const vfsKey = findVirtualFileSystemKeyAndFollowLinks(path_);
  return VIRTUAL_FILESYSTEM[vfsKey];
}

// /////////////////////////////////////////////////////////////////
// PROJECT /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

const xpdn = path.dirname(EXECPATH);
const maxUplevels = xpdn.split(path.sep).length;
function projectToFilesystem(f) {
  const relatives = [];
  relatives.push(
    removeUplevels(path.relative(path.dirname(DEFAULT_ENTRYPOINT), f))
  );

  if (relatives[0].slice(0, 'node_modules'.length) === 'node_modules') {
    // one more relative without starting 'node_modules'
    relatives.push(relatives[0].slice('node_modules'.length + 1));
  }

  const uplevels = [];
  for (let i = 0, u = ''; i < maxUplevels; i += 1) {
    uplevels.push(u);
    u += '/..';
  }

  const results = [];
  uplevels.forEach((uplevel) => {
    relatives.forEach((relative) => {
      results.push(path.join(xpdn, uplevel, relative));
    });
  });
  return results;
}

function projectToNearby(f) {
  return path.join(xpdn, path.basename(f));
}
function findNativeAddonSyncFreeFromRequire(path_) {
  if (!insideSnapshot(path_)) throw new Error(`UNEXPECTED-10 ${path_}`);
  if (path_.slice(-5) !== '.node') return null; // leveldown.node.js
  // check nearby first to prevent .node tampering
  const projector = projectToNearby(path_);
  if (fs.existsSync(projector)) return projector;
  const projectors = projectToFilesystem(path_);
  for (let i = 0; i < projectors.length; i += 1) {
    if (fs.existsSync(projectors[i])) return projectors[i];
  }
  return null;
}

function findNativeAddonSyncUnderRequire(path_) {
  if (!FLAG_ENABLE_PROJECT) return null;
  return findNativeAddonSyncFreeFromRequire(path_);
}

// /////////////////////////////////////////////////////////////////
// FLOW UTILS //////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

function asap(cb) {
  process.nextTick(cb);
}

function dezalgo(cb) {
  if (!cb) return cb;

  let sync = true;
  asap(() => {
    sync = false;
  });

  return function zalgoSafe() {
    const args = arguments;
    if (sync) {
      asap(() => {
        cb.apply(undefined, args);
      });
    } else {
      cb.apply(undefined, args);
    }
  };
}

function rethrow(error, arg) {
  if (error) throw error;
  return arg;
}

// /////////////////////////////////////////////////////////////////
// PAYLOAD /////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////
if (typeof PAYLOAD_POSITION !== 'number' || typeof PAYLOAD_SIZE !== 'number') {
  throw new Error('MUST HAVE PAYLOAD');
}

function readPayload(buffer, offset, length, position, callback) {
  fs.read(
    EXECPATH_FD,
    buffer,
    offset,
    length,
    PAYLOAD_POSITION + position,
    callback
  );
}

function readPayloadSync(buffer, offset, length, position) {
  return fs.readSync(
    EXECPATH_FD,
    buffer,
    offset,
    length,
    PAYLOAD_POSITION + position
  );
}

function payloadCopyUni(
  source,
  target,
  targetStart,
  sourceStart,
  sourceEnd,
  cb
) {
  const cb2 = cb || rethrow;
  if (sourceStart >= source[1]) return cb2(null, 0);
  if (sourceEnd >= source[1]) [, sourceEnd] = source;
  const payloadPos = source[0] + sourceStart;
  const targetPos = targetStart;
  const targetEnd = targetStart + sourceEnd - sourceStart;
  if (cb) {
    readPayload(target, targetPos, targetEnd - targetPos, payloadPos, cb);
  } else {
    return readPayloadSync(
      target,
      targetPos,
      targetEnd - targetPos,
      payloadPos
    );
  }
}

function payloadCopyMany(source, target, targetStart, sourceStart, cb) {
  const payloadPos = source[0] + sourceStart;
  let targetPos = targetStart;
  const targetEnd = targetStart + source[1] - sourceStart;
  readPayload(
    target,
    targetPos,
    targetEnd - targetPos,
    payloadPos,
    (error, chunkSize) => {
      if (error) return cb(error);
      sourceStart += chunkSize;
      targetPos += chunkSize;
      if (chunkSize !== 0 && targetPos < targetEnd) {
        payloadCopyMany(source, target, targetPos, sourceStart, cb);
      } else {
        return cb();
      }
    }
  );
}

function payloadCopyManySync(source, target, targetStart, sourceStart) {
  let payloadPos = source[0] + sourceStart;
  let targetPos = targetStart;
  const targetEnd = targetStart + source[1] - sourceStart;
  while (true) {
    const chunkSize = readPayloadSync(
      target,
      targetPos,
      targetEnd - targetPos,
      payloadPos
    );
    payloadPos += chunkSize;
    targetPos += chunkSize;
    if (!(chunkSize !== 0 && targetPos < targetEnd)) break;
  }
}

const GZIP = 1;
const BROTLI = 2;
function payloadFile(pointer, cb) {
  const target = Buffer.alloc(pointer[1]);
  payloadCopyMany(pointer, target, 0, 0, (error) => {
    if (error) return cb(error);
    if (DOCOMPRESS === GZIP) {
      gunzip(target, (error2, target2) => {
        if (error2) return cb(error2);
        cb(null, target2);
      });
    } else if (DOCOMPRESS === BROTLI) {
      brotliDecompress(target, (error2, target2) => {
        if (error2) return cb(error2);
        cb(null, target2);
      });
    } else {
      return cb(null, target);
    }
  });
}

function payloadFileSync(pointer) {
  const target = Buffer.alloc(pointer[1]);
  payloadCopyManySync(pointer, target, 0, 0);
  if (DOCOMPRESS === GZIP) {
    const target1 = gunzipSync(target);
    return target1;
  }
  if (DOCOMPRESS === BROTLI) {
    const target1 = brotliDecompressSync(target);
    return target1;
  }
  return target;
}

// /////////////////////////////////////////////////////////////////
// SETUP PROCESS ///////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

(() => {
  process.pkg = {};
  process.versions.pkg = '5.8.1';
  process.pkg.mount = createMountpoint;
  process.pkg.entrypoint = ENTRYPOINT;
  process.pkg.defaultEntrypoint = DEFAULT_ENTRYPOINT;
})();

// /////////////////////////////////////////////////////////////////
// PATH.RESOLVE REPLACEMENT ////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

(() => {
  process.pkg.path = {};
  process.pkg.path.resolve = function resolve() {
    const args = cloneArgs(arguments);
    args.unshift(path.dirname(ENTRYPOINT));
    return path.resolve.apply(path, args);
  };
})();

// /////////////////////////////////////////////////////////////////
// PATCH FS ////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

(() => {
  const ancestor = {
    openSync: fs.openSync,
    open: fs.open,
    readSync: fs.readSync,
    read: fs.read,
    writeSync: fs.writeSync,
    write: fs.write,
    closeSync: fs.closeSync,
    close: fs.close,
    readFileSync: fs.readFileSync,
    readFile: fs.readFile,
    // writeFileSync: fs.writeFileSync, // based on openSync/writeSync/closeSync
    // writeFile:     fs.writeFile, // based on open/write/close
    readdirSync: fs.readdirSync,
    readdir: fs.readdir,
    realpathSync: fs.realpathSync,
    realpath: fs.realpath,
    statSync: fs.statSync,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    lstat: fs.lstat,
    fstatSync: fs.fstatSync,
    fstat: fs.fstat,
    existsSync: fs.existsSync,
    exists: fs.exists,
    accessSync: fs.accessSync,
    access: fs.access,
    mkdirSync: fs.mkdirSync,
    mkdir: fs.mkdir,
    createReadStream: fs.createReadStream,
    copyFileSync: fs.copyFileSync,
    copyFile: fs.copyFile,
  };

  ancestor.realpathSync.native = fs.realpathSync;
  ancestor.realpath.native = fs.realpath;

  const windows = process.platform === 'win32';

  const docks = {};
  const ENOTDIR = windows ? 4052 : 20;
  const ENOENT = windows ? 4058 : 2;
  const EISDIR = windows ? 4068 : 21;

  function assertEncoding(encoding) {
    if (encoding && !Buffer.isEncoding(encoding)) {
      throw new Error(`Unknown encoding: ${encoding}`);
    }
  }

  function maybeCallback(args) {
    const cb = args[args.length - 1];
    return typeof cb === 'function' ? cb : rethrow;
  }

  function error_ENOENT(fileOrDirectory, path_) {
    const error = new Error(
      `${fileOrDirectory} '${stripSnapshot(path_)}' ` +
        `was not included into executable at compilation stage. ` +
        `Please recompile adding it as asset or script.`
    );
    error.errno = -ENOENT;
    error.code = 'ENOENT';
    error.path = path_;
    error.pkg = true;
    return error;
  }

  function error_EISDIR(path_) {
    const error = new Error('EISDIR: illegal operation on a directory, read');
    error.errno = -EISDIR;
    error.code = 'EISDIR';
    error.path = path_;
    error.pkg = true;
    return error;
  }

  function error_ENOTDIR(path_) {
    const error = new Error(`ENOTDIR: not a directory, scandir '${path_}'`);
    error.errno = -ENOTDIR;
    error.code = 'ENOTDIR';
    error.path = path_;
    error.pkg = true;
    return error;
  }

  // ///////////////////////////////////////////////////////////////
  // open //////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function removeTemporaryFolderAndContent(folder) {
    if (!folder) return;
    if (NODE_VERSION_MAJOR <= 14) {
      if (NODE_VERSION_MAJOR <= 10) {
        // folder must be empty
        for (const f of fs.readdirSync(folder)) {
          fs.unlinkSync(path.join(folder, f));
        }
        fs.rmdirSync(folder);
      } else {
        fs.rmdirSync(folder, { recursive: true });
      }
    } else {
      fs.rmSync(folder, { recursive: true });
    }
  }
  const temporaryFiles = {};
  const os = require('os');
  let tmpFolder = '';
  process.on('beforeExit', () => {
    removeTemporaryFolderAndContent(tmpFolder);
  });
  function deflateSync(snapshotFilename) {
    if (!tmpFolder) {
      tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'pkg-'));
    }
    const content = fs.readFileSync(snapshotFilename, { encoding: 'binary' });
    // content is already unzipped !

    const hash = createHash('sha256').update(content).digest('hex');
    const fName = path.join(tmpFolder, hash);
    fs.writeFileSync(fName, content, 'binary');
    return fName;
  }

  const uncompressExternally = function uncompressExternally(dock) {
    if (!dock.externalFilename) {
      const snapshotFilename = dock.path;
      let t = temporaryFiles[snapshotFilename];
      if (!t) {
        const tmpFile = deflateSync(snapshotFilename);
        t = { tmpFile };
        temporaryFiles[snapshotFilename] = t;
      }
      dock.externalFilename = t.tmpFile;
    }
    return dock.externalFilename;
  };

  function uncompressExternallyPath(path_) {
    const entity = findVirtualFileSystemEntry(path_);
    const dock = { path: path_, entity, position: 0 };
    return uncompressExternally(dock);
  }

  function uncompressExternallyAndOpen(dock) {
    const externalFile = uncompressExternally(dock);
    const fd = fs.openSync(externalFile, 'r');
    return fd;
  }

  function openFromSnapshot(path_, uncompress, cb) {
    const cb2 = cb || rethrow;
    const entity = findVirtualFileSystemEntry(path_);
    if (!entity) return cb2(error_ENOENT('File or directory', path_));
    const dock = { path: path_, entity, position: 0 };

    const nullDevice = windows ? '\\\\.\\NUL' : '/dev/null';
    if (cb) {
      ancestor.open.call(fs, nullDevice, 'r', (error, fd) => {
        if (error) return cb(error);
        if (DOCOMPRESS) {
          dock._externalFile = uncompressExternallyAndOpen(dock);
        }
        docks[fd] = dock;
        cb(null, fd);
      });
    } else {
      const fd = ancestor.openSync.call(fs, nullDevice, 'r');
      if (DOCOMPRESS) {
        dock._externalFile = uncompressExternallyAndOpen(dock);
      }
      docks[fd] = dock;
      return fd;
    }
  }

  fs.createReadStream = function createReadStream(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.createReadStream.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.createReadStream.apply(
        fs,
        translateNth(arguments, 0, path_)
      );
    }
    const stream = ancestor.createReadStream.apply(fs, arguments);
    return stream;
  };
  fs.openSync = function openSync(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.openSync.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.openSync.apply(fs, translateNth(arguments, 0, path_));
    }
    return openFromSnapshot(path_, DOCOMPRESS);
  };

  fs.open = function open(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.open.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.open.apply(fs, translateNth(arguments, 0, path_));
    }
    const callback = dezalgo(maybeCallback(arguments));
    openFromSnapshot(path_, DOCOMPRESS, callback);
  };

  // ///////////////////////////////////////////////////////////////
  // read //////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function readFromSnapshotSub(
    entityContent,
    dock,
    buffer,
    offset,
    length,
    position,
    cb
  ) {
    if (DOCOMPRESS) {
      // note: source contains info about a compressed file and source[1] does not reflect
      //       the actual size of the file.
      //       so random access reading of a compressed virtual file, requires read from
      //       an externally decompressed file
      if (!dock._externalFile) {
        dock._externalFile = uncompressExternallyAndOpen(dock);
      } else {
        position = position === undefined ? 0 : position;
      }
      return fs.read(dock._externalFile, buffer, offset, length, position, cb);
    }
    let p;
    if (position !== null && position !== undefined) {
      p = position;
    } else {
      p = dock.position;
    }
    if (cb) {
      payloadCopyUni(
        entityContent,
        buffer,
        offset,
        p,
        p + length,
        (error, bytesRead, buffer2) => {
          if (error) return cb(error);
          dock.position = p + bytesRead;
          cb(null, bytesRead, buffer2);
        }
      );
    } else {
      const bytesRead = payloadCopyUni(
        entityContent,
        buffer,
        offset,
        p,
        p + length
      );
      dock.position = p + bytesRead;
      return bytesRead;
    }
  }

  function readFromSnapshot(fd, buffer, offset, length, position, cb) {
    const dock = docks[fd];

    if (dock && dock._externalFile) {
      if (cb) {
        return ancestor.read(
          dock._externalFile,
          buffer,
          offset,
          length,
          position,
          cb
        );
      }
      return ancestor.readSync(
        dock._externalFile,
        buffer,
        offset,
        length,
        position
      );
    }
    const cb2 = cb || rethrow;
    if (offset < 0 && NODE_VERSION_MAJOR >= 14)
      return cb2(
        new Error(
          `The value of "offset" is out of range. It must be >= 0. Received ${offset}`
        )
      );
    if (offset < 0 && NODE_VERSION_MAJOR >= 10)
      return cb2(
        new Error(
          `The value of "offset" is out of range. It must be >= 0 && <= ${buffer.length.toString()}. Received ${offset}`
        )
      );
    if (offset < 0) return cb2(new Error('Offset is out of bounds'));
    if (offset >= buffer.length) return cb2(null, 0);
    if (offset + length > buffer.length && NODE_VERSION_MAJOR >= 14)
      return cb2(
        new Error(
          `The value of "length" is out of range. It must be <= ${(
            buffer.length - offset
          ).toString()}. Received ${length.toString()}`
        )
      );
    if (offset + length > buffer.length && NODE_VERSION_MAJOR >= 10)
      return cb2(
        new Error(
          `The value of "length" is out of range. It must be >= 0 && <= ${(
            buffer.length - offset
          ).toString()}. Received ${length.toString()}`
        )
      );
    if (offset + length > buffer.length)
      return cb2(new Error('Length extends beyond buffer'));

    const { entity } = dock;
    const entityLinks = entity[STORE_LINKS];
    if (entityLinks) return cb2(error_EISDIR(dock.path));
    const entityContent = entity[STORE_CONTENT];
    if (entityContent)
      return readFromSnapshotSub(
        entityContent,
        dock,
        buffer,
        offset,
        length,
        position,
        cb
      );
    return cb2(new Error('UNEXPECTED-15'));
  }

  fs.readSync = function readSync(fd, buffer, offset, length, position) {
    if (!docks[fd]) {
      return ancestor.readSync.apply(fs, arguments);
    }
    return readFromSnapshot(fd, buffer, offset, length, position);
  };

  fs.read = function read(fd, buffer, offset, length, position) {
    if (!docks[fd]) {
      return ancestor.read.apply(fs, arguments);
    }

    const callback = dezalgo(maybeCallback(arguments));
    readFromSnapshot(fd, buffer, offset, length, position, callback);
  };

  // ///////////////////////////////////////////////////////////////
  // write /////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function writeToSnapshot(cb) {
    const cb2 = cb || rethrow;
    return cb2(new Error('Cannot write to packaged file'));
  }

  fs.writeSync = function writeSync(fd) {
    if (!docks[fd]) {
      return ancestor.writeSync.apply(fs, arguments);
    }

    return writeToSnapshot();
  };

  fs.write = function write(fd) {
    if (!docks[fd]) {
      return ancestor.write.apply(fs, arguments);
    }
    const callback = dezalgo(maybeCallback(arguments));
    return writeToSnapshot(callback);
  };

  // ///////////////////////////////////////////////////////////////
  // close /////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  const closeFromSnapshot = (fd, cb) => {
    const dock = docks[fd];
    if (dock._externalFile) {
      ancestor.closeSync(dock._externalFile);
      dock._externalFile = undefined;
    }
    delete docks[fd];
    if (cb) {
      ancestor.close.call(fs, fd, cb);
    } else {
      return ancestor.closeSync.call(fs, fd);
    }
  };

  fs.closeSync = function closeSync(fd) {
    if (!docks[fd]) {
      return ancestor.closeSync.apply(fs, arguments);
    }
    return closeFromSnapshot(fd);
  };

  fs.close = function close(fd) {
    if (!docks[fd]) {
      return ancestor.close.apply(fs, arguments);
    }

    const callback = dezalgo(maybeCallback(arguments));
    closeFromSnapshot(fd, callback);
  };

  // ///////////////////////////////////////////////////////////////
  // readFile //////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function readFileOptions(options, hasCallback) {
    if (!options || (hasCallback && typeof options === 'function')) {
      return { encoding: null, flag: 'r' };
    }
    if (typeof options === 'string') {
      return { encoding: options, flag: 'r' };
    }
    if (typeof options === 'object') {
      return options;
    }
    return null;
  }

  function readFileFromSnapshotSub(entityContent, cb) {
    if (cb) {
      payloadFile(entityContent, cb);
    } else {
      return payloadFileSync(entityContent);
    }
  }

  function readFileFromSnapshot(path_, cb) {
    const cb2 = cb || rethrow;

    const entity = findVirtualFileSystemEntry(path_);
    if (!entity) return cb2(error_ENOENT('File', path_));

    const entityLinks = entity[STORE_LINKS];
    if (entityLinks) return cb2(error_EISDIR(path_));

    const entityContent = entity[STORE_CONTENT];
    if (entityContent) return readFileFromSnapshotSub(entityContent, cb);

    const entityBlob = entity[STORE_BLOB];
    if (entityBlob) {
      return cb2(null, Buffer.from('source-code-not-available'));
    }
    // why return empty buffer?
    // otherwise this error will arise:
    // Error: UNEXPECTED-20
    //     at readFileFromSnapshot (e:0)
    //     at Object.fs.readFileSync (e:0)
    //     at Object.Module._extensions..js (module.js:421:20)
    //     at Module.load (module.js:357:32)
    //     at Function.Module._load (module.js:314:12)
    //     at Function.Module.runMain (e:0)
    //     at startup (node.js:140:18)
    //     at node.js:1001:3

    return cb2(new Error('UNEXPECTED-20'));
  }

  fs.readFileSync = function readFileSync(path_, options_) {
    if (path_ === 'dirty-hack-for-testing-purposes') {
      return path_;
    }

    if (!insideSnapshot(path_)) {
      return ancestor.readFileSync.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.readFileSync.apply(fs, translateNth(arguments, 0, path_));
    }

    const options = readFileOptions(options_, false);

    if (!options) {
      return ancestor.readFileSync.apply(fs, arguments);
    }

    const { encoding } = options;
    assertEncoding(encoding);

    let buffer = readFileFromSnapshot(path_);
    if (encoding) buffer = buffer.toString(encoding);
    return buffer;
  };

  fs.readFile = function readFile(path_, options_) {
    if (!insideSnapshot(path_)) {
      return ancestor.readFile.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.readFile.apply(fs, translateNth(arguments, 0, path_));
    }

    const options = readFileOptions(options_, true);

    if (!options) {
      return ancestor.readFile.apply(fs, arguments);
    }

    const { encoding } = options;
    assertEncoding(encoding);

    const callback = dezalgo(maybeCallback(arguments));
    readFileFromSnapshot(path_, (error, buffer) => {
      if (error) return callback(error);
      if (encoding) buffer = buffer.toString(encoding);
      callback(null, buffer);
    });
  };

  fs.copyFile = function copyFile(src, dest, flags, callback) {
    if (!insideSnapshot(path.resolve(src))) {
      ancestor.copyFile(src, dest, flags, callback);
      return;
    }
    if (typeof flags === 'function') {
      callback = flags;
      flags = 0;
    } else if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function');
    }

    function _streamCopy() {
      fs.createReadStream(src)
        .on('error', callback)
        .pipe(fs.createWriteStream(dest))
        .on('error', callback)
        .on('finish', callback);
    }

    if (flags & fs.constants.COPYFILE_EXCL) {
      fs.stat(dest, (statError) => {
        if (!statError) {
          callback(
            Object.assign(new Error('File already exists'), {
              code: 'EEXIST',
            })
          );
          return;
        }
        if (statError.code !== 'ENOENT') {
          callback(statError);
          return;
        }
        _streamCopy();
      });
    } else {
      _streamCopy();
    }
  };

  fs.copyFileSync = function copyFileSync(src, dest, flags) {
    if (!insideSnapshot(path.resolve(src))) {
      ancestor.copyFileSync(src, dest, flags);
      return;
    }

    if (flags & fs.constants.COPYFILE_EXCL) {
      try {
        fs.statSync(dest);
      } catch (statError) {
        if (statError.code !== 'ENOENT') throw statError;
        copyInChunks(src, dest, DEFAULT_COPY_CHUNK_SIZE, fs);
        return;
      }

      throw Object.assign(new Error('File already exists'), { code: 'EEXIST' });
    }
    copyInChunks(src, dest, DEFAULT_COPY_CHUNK_SIZE, fs);
  };

  // ///////////////////////////////////////////////////////////////
  // writeFile /////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  // writeFileSync based on openSync/writeSync/closeSync
  // writeFile based on open/write/close

  // ///////////////////////////////////////////////////////////////
  // readdir ///////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function readdirOptions(options, hasCallback) {
    if (!options || (hasCallback && typeof options === 'function')) {
      return { encoding: null };
    }
    if (typeof options === 'string') {
      return { encoding: options };
    }
    if (typeof options === 'object') {
      return options;
    }
    return null;
  }

  function Dirent(name, type) {
    this.name = name;
    this.type = type;
  }

  Dirent.prototype.isDirectory = function isDirectory() {
    return this.type === 2;
  };

  Dirent.prototype.isFile = function isFile() {
    return this.type === 1;
  };

  const noop = () => false;
  Dirent.prototype.isBlockDevice = noop;
  Dirent.prototype.isCharacterDevice = noop;
  Dirent.prototype.isSocket = noop;
  Dirent.prototype.isFIFO = noop;

  Dirent.prototype.isSymbolicLink = (fileOrFolderName) =>
    Boolean(SYMLINKS[fileOrFolderName]);

  function getFileTypes(path_, entries) {
    return entries.map((entry) => {
      const ff = path.join(path_, entry);
      const entity = findVirtualFileSystemEntry(ff);
      if (!entity) return undefined;
      if (entity[STORE_BLOB] || entity[STORE_CONTENT])
        return new Dirent(entry, 1);
      if (entity[STORE_LINKS]) return new Dirent(entry, 2);
      throw new Error('UNEXPECTED-24');
    });
  }

  function readdirRoot(path_, options, cb) {
    function addSnapshot(entries) {
      if (options && options.withFileTypes) {
        entries.push(new Dirent('snapshot', 2));
      } else {
        entries.push('snapshot');
      }
    }

    if (cb) {
      ancestor.readdir(path_, options, (error, entries) => {
        if (error) return cb(error);
        addSnapshot(entries);
        cb(null, entries);
      });
    } else {
      const entries = ancestor.readdirSync(path_, options);
      addSnapshot(entries);
      return entries;
    }
  }

  function readdirFromSnapshotSub(entityLinks, path_, cb) {
    if (cb) {
      payloadFile(entityLinks, (error, buffer) => {
        if (error) return cb(error);
        cb(null, JSON.parse(buffer).concat(readdirMountpoints(path_)));
      });
    } else {
      const buffer = payloadFileSync(entityLinks);
      return JSON.parse(buffer).concat(readdirMountpoints(path_));
    }
  }

  function readdirFromSnapshot(path_, cb) {
    const cb2 = cb || rethrow;
    const entity = findVirtualFileSystemEntry(path_);

    if (!entity) {
      return cb2(error_ENOENT('Directory', path_));
    }

    const entityBlob = entity[STORE_BLOB];
    if (entityBlob) {
      return cb2(error_ENOTDIR(path_));
    }

    const entityContent = entity[STORE_CONTENT];
    if (entityContent) {
      return cb2(error_ENOTDIR(path_));
    }

    const entityLinks = entity[STORE_LINKS];
    if (entityLinks) {
      return readdirFromSnapshotSub(entityLinks, path_, cb);
    }
    return cb2(new Error('UNEXPECTED-25'));
  }

  fs.readdirSync = function readdirSync(path_, options_) {
    const isRoot = isRootPath(path_);

    if (!insideSnapshot(path_) && !isRoot) {
      return ancestor.readdirSync.apply(fs, arguments);
    }

    if (insideMountpoint(path_)) {
      return ancestor.readdirSync.apply(fs, translateNth(arguments, 0, path_));
    }

    const options = readdirOptions(options_, false);

    if (isRoot) {
      return readdirRoot(path_, options);
    }

    if (!options) {
      return ancestor.readdirSync.apply(fs, arguments);
    }

    let entries = readdirFromSnapshot(path_);
    if (options.withFileTypes) entries = getFileTypes(path_, entries);
    return entries;
  };

  fs.readdir = function readdir(path_, options_) {
    const isRoot = isRootPath(path_);

    if (!insideSnapshot(path_) && !isRoot) {
      return ancestor.readdir.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.readdir.apply(fs, translateNth(arguments, 0, path_));
    }

    const options = readdirOptions(options_, true);
    const callback = dezalgo(maybeCallback(arguments));

    if (isRoot) {
      return readdirRoot(path_, options, callback);
    }

    if (!options) {
      return ancestor.readdir.apply(fs, arguments);
    }

    readdirFromSnapshot(path_, (error, entries) => {
      if (error) return callback(error);
      if (options.withFileTypes) entries = getFileTypes(path_, entries);
      callback(null, entries);
    });
  };

  // ///////////////////////////////////////////////////////////////
  // realpath //////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  fs.realpathSync = function realpathSync(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.realpathSync.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      // app should not know real file name
      return path_;
    }

    const realPath = realpathFromSnapshot(path_);
    return realPath;
  };

  fs.realpath = function realpath(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.realpath.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      // app should not know real file name
      return path_;
    }

    const callback = dezalgo(maybeCallback(arguments));
    callback(null, realpathFromSnapshot(path_));
  };

  fs.realpathSync.native = fs.realpathSync;
  fs.realpath.native = fs.realpath;

  // ///////////////////////////////////////////////////////////////
  // stat //////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function restore(s) {
    s.blksize = 4096;
    s.blocks = 0;
    s.dev = 0;
    s.gid = 20;
    s.ino = 0;
    s.nlink = 0;
    s.rdev = 0;
    s.uid = 500;

    s.atime = new Date(EXECSTAT.atime);
    s.mtime = new Date(EXECSTAT.mtime);
    s.ctime = new Date(EXECSTAT.ctime);
    s.birthtime = new Date(EXECSTAT.birthtime);

    s.atimeMs = EXECSTAT.atimeMs;
    s.mtimeMs = EXECSTAT.mtimeMs;
    s.ctimeMs = EXECSTAT.ctimeMs;
    s.birthtimeMs = EXECSTAT.birthtimeMs;

    const { isFileValue } = s;
    const { isDirectoryValue } = s;
    const { isSocketValue } = s;
    const { isSymbolicLinkValue } = s;

    delete s.isFileValue;
    delete s.isDirectoryValue;
    delete s.isSocketValue;
    delete s.isSymbolicLinkValue;

    s.isFile = function isFile() {
      return isFileValue;
    };
    s.isDirectory = function isDirectory() {
      return isDirectoryValue;
    };
    s.isSocket = function isSocket() {
      return isSocketValue;
    };
    s.isSymbolicLink = function isSymbolicLink() {
      return isSymbolicLinkValue;
    };
    s.isFIFO = function isFIFO() {
      return false;
    };

    return s;
  }

  function findNativeAddonForStat(path_, cb) {
    const cb2 = cb || rethrow;
    const foundPath = findNativeAddonSyncUnderRequire(path_);
    if (!foundPath) return cb2(error_ENOENT('File or directory', path_));
    if (cb) {
      ancestor.stat.call(fs, foundPath, cb);
    } else {
      return ancestor.statSync.call(fs, foundPath);
    }
  }

  function statFromSnapshotSub(entityStat, cb) {
    if (cb) {
      payloadFile(entityStat, (error, buffer) => {
        if (error) return cb(error);
        cb(null, restore(JSON.parse(buffer)));
      });
    } else {
      const buffer = payloadFileSync(entityStat);
      return restore(JSON.parse(buffer));
    }
  }

  function statFromSnapshot(path_, cb) {
    const cb2 = cb || rethrow;
    const entity = findVirtualFileSystemEntry(path_);
    if (!entity) return findNativeAddonForStat(path_, cb);
    const entityStat = entity[STORE_STAT];
    if (entityStat) return statFromSnapshotSub(entityStat, cb);
    return cb2(new Error('UNEXPECTED-35'));
  }

  fs.statSync = function statSync(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.statSync.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.statSync.apply(fs, translateNth(arguments, 0, path_));
    }

    return statFromSnapshot(path_);
  };

  fs.stat = function stat(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.stat.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.stat.apply(fs, translateNth(arguments, 0, path_));
    }

    const callback = dezalgo(maybeCallback(arguments));
    statFromSnapshot(path_, callback);
  };

  // ///////////////////////////////////////////////////////////////
  // lstat /////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  fs.lstatSync = function lstatSync(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.lstatSync.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.lstatSync.apply(fs, translateNth(arguments, 0, path_));
    }

    return statFromSnapshot(path_);
  };

  fs.lstat = function lstat(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.lstat.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.lstat.apply(fs, translateNth(arguments, 0, path_));
    }

    const callback = dezalgo(maybeCallback(arguments));
    statFromSnapshot(path_, callback);
  };

  // ///////////////////////////////////////////////////////////////
  // fstat /////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function fstatFromSnapshot(fd, cb) {
    const cb2 = cb || rethrow;
    const { entity } = docks[fd];
    const entityStat = entity[STORE_STAT];
    if (entityStat) return statFromSnapshotSub(entityStat, cb);
    return cb2(new Error('UNEXPECTED-40'));
  }

  fs.fstatSync = function fstatSync(fd) {
    if (!docks[fd]) {
      return ancestor.fstatSync.apply(fs, arguments);
    }

    return fstatFromSnapshot(fd);
  };

  fs.fstat = function fstat(fd) {
    if (!docks[fd]) {
      return ancestor.fstat.apply(fs, arguments);
    }

    const callback = dezalgo(maybeCallback(arguments));
    fstatFromSnapshot(fd, callback);
  };

  // ///////////////////////////////////////////////////////////////
  // exists ////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function findNativeAddonForExists(path_) {
    const foundPath = findNativeAddonSyncFreeFromRequire(path_);
    if (!foundPath) return false;
    return ancestor.existsSync.call(fs, foundPath);
  }

  function existsFromSnapshot(path_) {
    const entity = findVirtualFileSystemEntry(path_);
    if (!entity) return findNativeAddonForExists(path_);
    return true;
  }

  fs.existsSync = function existsSync(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.existsSync.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.existsSync.apply(fs, translateNth(arguments, 0, path_));
    }

    return existsFromSnapshot(path_);
  };

  fs.exists = function exists(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.exists.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.exists.apply(fs, translateNth(arguments, 0, path_));
    }

    const callback = dezalgo(maybeCallback(arguments));
    callback(existsFromSnapshot(path_));
  };

  // ///////////////////////////////////////////////////////////////
  // access ////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function accessFromSnapshot(path_, cb) {
    const cb2 = cb || rethrow;
    const entity = findVirtualFileSystemEntry(path_);
    if (!entity) return cb2(error_ENOENT('File or directory', path_));
    return cb2(null, undefined);
  }

  fs.accessSync = function accessSync(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.accessSync.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.accessSync.apply(fs, translateNth(arguments, 0, path_));
    }

    return accessFromSnapshot(path_);
  };

  fs.access = function access(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.access.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.access.apply(fs, translateNth(arguments, 0, path_));
    }

    const callback = dezalgo(maybeCallback(arguments));
    accessFromSnapshot(path_, callback);
  };

  // ///////////////////////////////////////////////////////////////
  // mkdir /////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function mkdirFailInSnapshot(path_, cb) {
    const cb2 = cb || rethrow;
    return cb2(
      new Error('Cannot mkdir in a snapshot. Try mountpoints instead.')
    );
  }

  fs.mkdirSync = function mkdirSync(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.mkdirSync.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.mkdirSync.apply(fs, translateNth(arguments, 0, path_));
    }

    return mkdirFailInSnapshot(path_);
  };

  fs.mkdir = function mkdir(path_) {
    if (!insideSnapshot(path_)) {
      return ancestor.mkdir.apply(fs, arguments);
    }
    if (insideMountpoint(path_)) {
      return ancestor.mkdir.apply(fs, translateNth(arguments, 0, path_));
    }

    mkdirFailInSnapshot(path_, dezalgo(maybeCallback(arguments)));
  };

  // ///////////////////////////////////////////////////////////////
  // promises ////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  if (fs.promises !== undefined) {
    const ancestor_promises = {
      open: fs.promises.open,
      read: fs.promises.read,
      write: fs.promises.write,
      readFile: fs.promises.readFile,
      readdir: fs.promises.readdir,
      realpath: fs.promises.realpath,
      stat: fs.promises.stat,
      lstat: fs.promises.lstat,
      fstat: fs.promises.fstat,
      access: fs.promises.access,
      copyFile: fs.promises.copyFile,
    };

    fs.promises.open = async function open(path_) {
      if (!insideSnapshot(path_)) {
        return ancestor_promises.open.apply(this, arguments);
      }
      if (insideMountpoint(path_)) {
        return ancestor_promises.open.apply(
          this,
          translateNth(arguments, 0, path_)
        );
      }
      const externalFile = uncompressExternallyPath(path_);
      arguments[0] = externalFile;
      const fd = await ancestor_promises.open.apply(this, arguments);
      if (typeof fd === 'object') {
        fd._pkg = { externalFile, file: path_ };
      }
      return fd;
    };
    fs.promises.readFile = async function readFile(path_) {
      if (!insideSnapshot(path_)) {
        return ancestor_promises.readFile.apply(this, arguments);
      }
      if (insideMountpoint(path_)) {
        return ancestor_promises.readFile.apply(
          this,
          translateNth(arguments, 0, path_)
        );
      }
      const externalFile = uncompressExternallyPath(path_);
      arguments[0] = externalFile;
      return ancestor_promises.readFile.apply(this, arguments);
    };

    fs.promises.write = async function write(fd) {
      if (fd._pkg) {
        throw new Error(
          `[PKG] Cannot write into Snapshot file : ${fd._pkg.file}`
        );
      }
      return ancestor_promises.write.apply(this, arguments);
    };

    // this one use promisify on purpose
    fs.promises.readdir = util.promisify(fs.readdir);
    fs.promises.copyFile = util.promisify(fs.copyFile);
    fs.promises.stat = util.promisify(fs.stat);
    fs.promises.lstat = util.promisify(fs.lstat);

    /*
    fs.promises.read = util.promisify(fs.read);
    fs.promises.realpath = util.promisify(fs.realpath);
    fs.promises.fstat = util.promisify(fs.fstat);
    fs.promises.access = util.promisify(fs.access);
  */
  }

  // ///////////////////////////////////////////////////////////////
  // INTERNAL //////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////

  function makeLong(f) {
    return path._makeLong(f);
  }

  function revertMakingLong(f) {
    if (/^\\\\\?\\/.test(f)) return f.slice(4);
    return f;
  }

  function findNativeAddonForInternalModuleStat(path_) {
    const fNative = findNativeAddonSyncUnderRequire(path_);
    if (!fNative) return -ENOENT;
    return process.binding('fs').internalModuleStat(makeLong(fNative));
  }

  fs.internalModuleStat = function internalModuleStat(long) {
    // from node comments:
    // Used to speed up module loading. Returns 0 if the path refers to
    // a file, 1 when it's a directory or < 0 on error (usually -ENOENT).
    // The speedup comes from not creating thousands of Stat and Error objects.

    const path_ = revertMakingLong(long);

    if (!insideSnapshot(path_)) {
      return process.binding('fs').internalModuleStat(long);
    }
    if (insideMountpoint(path_)) {
      return process
        .binding('fs')
        .internalModuleStat(makeLong(translate(path_)));
    }

    const entity = findVirtualFileSystemEntry(path_);

    if (!entity) {
      return findNativeAddonForInternalModuleStat(path_);
    }

    const entityBlob = entity[STORE_BLOB];
    if (entityBlob) {
      return 0;
    }

    const entityContent = entity[STORE_CONTENT];
    if (entityContent) {
      return 0;
    }

    const entityLinks = entity[STORE_LINKS];
    if (entityLinks) {
      return 1;
    }

    return -ENOENT;
  };

  fs.internalModuleReadJSON = function internalModuleReadJSON(long) {
    // from node comments:
    // Used to speed up module loading. Returns the contents of the file as
    // a string or undefined when the file cannot be opened. The speedup
    // comes from not creating Error objects on failure.
    // For newer node versions (after https://github.com/nodejs/node/pull/33229 ):
    // Returns an array [string, boolean].
    //
    const returnArray =
      (NODE_VERSION_MAJOR === 12 && NODE_VERSION_MINOR >= 19) ||
      (NODE_VERSION_MAJOR === 14 && NODE_VERSION_MINOR >= 5) ||
      NODE_VERSION_MAJOR >= 15;

    const path_ = revertMakingLong(long);
    const bindingFs = process.binding('fs');
    const readFile = (
      bindingFs.internalModuleReadFile || bindingFs.internalModuleReadJSON
    ).bind(bindingFs);
    if (!insideSnapshot(path_)) {
      return readFile(long);
    }
    if (insideMountpoint(path_)) {
      return readFile(makeLong(translate(path_)));
    }

    const entity = findVirtualFileSystemEntry(path_);

    if (!entity) {
      return returnArray ? [undefined, false] : undefined;
    }

    const entityContent = entity[STORE_CONTENT];
    if (!entityContent) {
      return returnArray ? [undefined, false] : undefined;
    }
    return returnArray
      ? [payloadFileSync(entityContent).toString(), true]
      : payloadFileSync(entityContent).toString();
  };

  fs.internalModuleReadFile = fs.internalModuleReadJSON;
})();

// /////////////////////////////////////////////////////////////////
// PATCH MODULE ////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

(() => {
  const ancestor = {
    require: Module.prototype.require,
    _compile: Module.prototype._compile,
    _resolveFilename: Module._resolveFilename,
    runMain: Module.runMain,
  };

  Module.prototype.require = function require(path_) {
    try {
      return ancestor.require.apply(this, arguments);
    } catch (error) {
      if (
        (error.code === 'ENOENT' || error.code === 'MODULE_NOT_FOUND') &&
        !insideSnapshot(path_) &&
        !path.isAbsolute(path_)
      ) {
        if (!error.pkg) {
          error.pkg = true;
          error.message +=
            '\n' +
            '1) If you want to compile the package/file into ' +
            'executable, please pay attention to compilation ' +
            "warnings and specify a literal in 'require' call. " +
            "2) If you don't want to compile the package/file " +
            "into executable and want to 'require' it from " +
            'filesystem (likely plugin), specify an absolute ' +
            "path in 'require' call using process.cwd() or " +
            'process.execPath.';
        }
      }
      throw error;
    }
  };

  let im;
  let makeRequireFunction;

  if (NODE_VERSION_MAJOR <= 9) {
    im = require('internal/module');
    makeRequireFunction = im.makeRequireFunction;
  } else {
    im = require('internal/modules/cjs/helpers');
    makeRequireFunction = im.makeRequireFunction;
    // TODO esm modules along with cjs
  }

  Module.prototype._compile = function _compile(content, filename_) {
    if (!insideSnapshot(filename_)) {
      return ancestor._compile.apply(this, arguments);
    }
    if (insideMountpoint(filename_)) {
      // DON'T TRANSLATE! otherwise __dirname gets real name
      return ancestor._compile.apply(this, arguments);
    }

    const entity = findVirtualFileSystemEntry(filename_);

    if (!entity) {
      // let user try to "_compile" a packaged file
      return ancestor._compile.apply(this, arguments);
    }

    const entityBlob = entity[STORE_BLOB];
    const entityContent = entity[STORE_CONTENT];

    if (entityBlob) {
      const options = {
        filename: filename_,
        lineOffset: 0,
        displayErrors: true,
        cachedData: payloadFileSync(entityBlob),
        sourceless: !entityContent,
      };

      const code = entityContent
        ? Module.wrap(payloadFileSync(entityContent))
        : undefined;

      const script = new Script(code, options);
      const wrapper = script.runInThisContext(options);
      if (!wrapper) process.exit(4); // for example VERSION_MISMATCH
      const dirname = path.dirname(filename_);
      const rqfn = makeRequireFunction(this);
      const args = [this.exports, rqfn, this, filename_, dirname];
      return wrapper.apply(this.exports, args);
    }

    if (entityContent) {
      if (entityBlob) throw new Error('UNEXPECTED-50');
      // content is already in utf8 and without BOM (that is expected
      // by stock _compile), but entityContent is still a Buffer
      return ancestor._compile.apply(this, arguments);
    }

    throw new Error('UNEXPECTED-55');
  };

  Module._resolveFilename = function _resolveFilename() {
    let filename;
    let flagWasOn = false;
    try {
      filename = ancestor._resolveFilename.apply(this, arguments);
    } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') throw error;

      FLAG_ENABLE_PROJECT = true;
      const savePathCache = Module._pathCache;
      Module._pathCache = Object.create(null);
      try {
        filename = ancestor._resolveFilename.apply(this, arguments);
        flagWasOn = true;
      } finally {
        Module._pathCache = savePathCache;
        FLAG_ENABLE_PROJECT = false;
      }
    }
    if (!insideSnapshot(filename)) {
      return filename;
    }
    if (insideMountpoint(filename)) {
      return filename;
    }

    if (flagWasOn) {
      FLAG_ENABLE_PROJECT = true;
      try {
        const found = findNativeAddonSyncUnderRequire(filename);
        if (found) filename = found;
      } finally {
        FLAG_ENABLE_PROJECT = false;
      }
    }

    return filename;
  };

  Module.runMain = function runMain() {
    Module._load(ENTRYPOINT, null, true);
    process._tickCallback();
  };
})();

// /////////////////////////////////////////////////////////////////
// PATCH CHILD_PROCESS /////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////
(() => {
  const ancestor = {
    spawn: childProcess.spawn,
    spawnSync: childProcess.spawnSync,
    execFile: childProcess.execFile,
    execFileSync: childProcess.execFileSync,
    exec: childProcess.exec,
    execSync: childProcess.execSync,
  };

  function setOptsEnv(args) {
    let pos = args.length - 1;
    if (typeof args[pos] === 'function') pos -= 1;
    if (typeof args[pos] !== 'object' || Array.isArray(args[pos])) {
      pos += 1;
      args.splice(pos, 0, {});
    }
    const opts = args[pos];
    if (!opts.env) opts.env = _extend({}, process.env);
    if (opts.env.PKG_EXECPATH === 'PKG_INVOKE_NODEJS') return;
    opts.env.PKG_EXECPATH = EXECPATH;
  }

  function startsWith2(args, index, name, impostor) {
    const qsName = `"${name} `;
    if (args[index].slice(0, qsName.length) === qsName) {
      args[index] = `"${impostor} ${args[index].slice(qsName.length)}`;
      return true;
    }
    const sName = `${name} `;
    if (args[index].slice(0, sName.length) === sName) {
      args[index] = `${impostor} ${args[index].slice(sName.length)}`;
      return true;
    }
    if (args[index] === name) {
      args[index] = impostor;
      return true;
    }
    return false;
  }

  function startsWith(args, index, name) {
    const qName = `"${name}"`;
    const qEXECPATH = `"${EXECPATH}"`;
    const jsName = JSON.stringify(name);
    const jsEXECPATH = JSON.stringify(EXECPATH);
    return (
      startsWith2(args, index, name, EXECPATH) ||
      startsWith2(args, index, qName, qEXECPATH) ||
      startsWith2(args, index, jsName, jsEXECPATH)
    );
  }

  function modifyLong(args, index) {
    if (!args[index]) return;
    return (
      startsWith(args, index, 'node') ||
      startsWith(args, index, ARGV0) ||
      startsWith(args, index, ENTRYPOINT) ||
      startsWith(args, index, EXECPATH)
    );
  }

  function modifyShort(args) {
    if (!args[0]) return;
    if (!Array.isArray(args[1])) {
      args.splice(1, 0, []);
    }
    if (
      args[0] === 'node' ||
      args[0] === ARGV0 ||
      args[0] === ENTRYPOINT ||
      args[0] === EXECPATH
    ) {
      args[0] = EXECPATH;
    } else {
      for (let i = 1; i < args[1].length; i += 1) {
        const mbc = args[1][i - 1];
        if (mbc === '-c' || mbc === '/c') {
          modifyLong(args[1], i);
        }
      }
    }
  }

  childProcess.spawn = function spawn() {
    const args = cloneArgs(arguments);
    setOptsEnv(args);
    modifyShort(args);
    return ancestor.spawn.apply(childProcess, args);
  };

  childProcess.spawnSync = function spawnSync() {
    const args = cloneArgs(arguments);
    setOptsEnv(args);
    modifyShort(args);
    return ancestor.spawnSync.apply(childProcess, args);
  };

  childProcess.execFile = function execFile() {
    const args = cloneArgs(arguments);
    setOptsEnv(args);
    modifyShort(args);
    return ancestor.execFile.apply(childProcess, args);
  };

  childProcess.execFileSync = function execFileSync() {
    const args = cloneArgs(arguments);
    setOptsEnv(args);
    modifyShort(args);
    return ancestor.execFileSync.apply(childProcess, args);
  };

  childProcess.exec = function exec() {
    const args = cloneArgs(arguments);
    setOptsEnv(args);
    modifyLong(args, 0);
    return ancestor.exec.apply(childProcess, args);
  };

  childProcess.execSync = function execSync() {
    const args = cloneArgs(arguments);
    setOptsEnv(args);
    modifyLong(args, 0);
    return ancestor.execSync.apply(childProcess, args);
  };
})();

// /////////////////////////////////////////////////////////////////
// PROMISIFY ///////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////
(() => {
  const { custom } = promisify;
  const { customPromisifyArgs } = require('internal/util');

  // /////////////////////////////////////////////////////////////
  // FS //////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////

  Object.defineProperty(fs.exists, custom, {
    value(path_) {
      return new Promise((resolve) => {
        fs.exists(path_, (exists) => {
          resolve(exists);
        });
      });
    },
  });

  Object.defineProperty(fs.read, customPromisifyArgs, {
    value: ['bytesRead', 'buffer'],
  });

  Object.defineProperty(fs.write, customPromisifyArgs, {
    value: ['bytesWritten', 'buffer'],
  });

  // /////////////////////////////////////////////////////////////
  // CHILD_PROCESS ///////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////

  const customPromiseExecFunction =
    (o) =>
    (...args) => {
      let resolve;
      let reject;
      const p = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });

      p.child = o.apply(
        undefined,
        args.concat((error, stdout, stderr) => {
          if (error !== null) {
            error.stdout = stdout;
            error.stderr = stderr;
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        })
      );

      return p;
    };

  Object.defineProperty(childProcess.exec, custom, {
    value: customPromiseExecFunction(childProcess.exec),
  });

  Object.defineProperty(childProcess.execFile, custom, {
    value: customPromiseExecFunction(childProcess.execFile),
  });
})();

// /////////////////////////////////////////////////////////////////
// PATCH PROCESS ///////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////
(() => {
  const ancestor = {
    dlopen: process.dlopen,
  };

  function revertMakingLong(f) {
    if (/^\\\\\?\\/.test(f)) return f.slice(4);
    return f;
  }

  process.dlopen = function dlopen() {
    const args = cloneArgs(arguments);
    const modulePath = revertMakingLong(args[1]);
    const moduleBaseName = path.basename(modulePath);
    const moduleFolder = path.dirname(modulePath);

    if (insideSnapshot(modulePath)) {
      const moduleContent = fs.readFileSync(modulePath);

      // Node addon files and .so cannot be read with fs directly, they are loaded with process.dlopen which needs a filesystem path
      // we need to write the file somewhere on disk first and then load it
      // the hash is needed to be sure we reload the module in case it changes
      const hash = createHash('sha256').update(moduleContent).digest('hex');

      // Example: /tmp/pkg/<hash>
      const tmpFolder = path.join(tmpdir(), 'pkg', hash);

      createDirRecursively(tmpFolder);

      // Example: moduleFolder = /snapshot/appname/node_modules/sharp/build/Release
      const parts = moduleFolder.split(path.sep);
      const mIndex = parts.indexOf('node_modules') + 1;

      let newPath;

      // it's a node addon file contained in node_modules folder
      // we copy the entire module folder in tmp folder
      if (mIndex > 0) {
        // Example: modulePackagePath = sharp/build/Release
        const modulePackagePath = parts.slice(mIndex).join(path.sep);
        // Example: modulePkgFolder = /snapshot/appname/node_modules/sharp
        const modulePkgFolder = parts.slice(0, mIndex + 1).join(path.sep);

        // here we copy all files from the snapshot module folder to temporary folder
        // we keep the module folder structure to prevent issues with modules that are statically
        // linked using relative paths (Fix #1075)
        copyFolderRecursiveSync(modulePkgFolder, tmpFolder);

        // Example: /tmp/pkg/<hash>/sharp/build/Release/sharp.node
        newPath = path.join(tmpFolder, modulePackagePath, moduleBaseName);
      } else {
        const tmpModulePath = path.join(tmpFolder, moduleBaseName);

        if (!fs.existsSync(tmpModulePath)) {
          fs.copyFileSync(modulePath, tmpModulePath);
        }

        // load the copied file in the temporary folder
        newPath = tmpModulePath;
      }

      // replace the path with the new module path
      args[1] = newPath;
    }

    return ancestor.dlopen.apply(process, args);
  };
})();

})(function (exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNormalizedRealPath = exports.removeUplevels = exports.stripSnapshot = exports.insideSnapshot = exports.snapshotify = exports.substituteDenominator = exports.retrieveDenominator = exports.isDotNODE = exports.isDotJSON = exports.isDotJS = exports.isPackageJson = exports.normalizePath = exports.isRootPath = exports.ALIAS_AS_RESOLVABLE = exports.ALIAS_AS_RELATIVE = exports.STORE_STAT = exports.STORE_LINKS = exports.STORE_CONTENT = exports.STORE_BLOB = void 0;
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.STORE_BLOB = 0;
exports.STORE_CONTENT = 1;
exports.STORE_LINKS = 2;
exports.STORE_STAT = 3;
exports.ALIAS_AS_RELATIVE = 0; // require("./file.js") // file or directory
exports.ALIAS_AS_RESOLVABLE = 1; // require("package")
const win32 = process.platform === 'win32';
const hasURL = typeof URL !== 'undefined';
function uppercaseDriveLetter(f) {
    if (f.slice(1, 3) !== ':\\')
        return f;
    return f[0].toUpperCase() + f.slice(1);
}
function removeTrailingSlashes(f) {
    if (f === '/') {
        return f; // dont remove from "/"
    }
    if (f.slice(1) === ':\\') {
        return f; // dont remove from "D:\"
    }
    let last = f.length - 1;
    while (true) {
        const char = f.charAt(last);
        if (char === '\\') {
            f = f.slice(0, -1);
            last -= 1;
        }
        else if (char === '/') {
            f = f.slice(0, -1);
            last -= 1;
        }
        else {
            break;
        }
    }
    return f;
}
const isUrl = (p) => hasURL && p instanceof URL;
function pathToString(p, win) {
    let result;
    if (Buffer.isBuffer(p)) {
        result = p.toString();
    }
    else if (isUrl(p)) {
        result = win ? p.pathname.replace(/^\//, '') : p.pathname;
    }
    else {
        result = p;
    }
    return result;
}
function isRootPath(p) {
    let file = pathToString(p, false);
    if (file === '.') {
        file = path_1.default.resolve(file);
    }
    return path_1.default.dirname(file) === p;
}
exports.isRootPath = isRootPath;
function normalizePath(f) {
    let file = pathToString(f, win32);
    if (!/^.:$/.test(file)) {
        file = path_1.default.normalize(file);
    } // 'c:' -> 'c:.'
    if (win32) {
        file = uppercaseDriveLetter(file);
    }
    return removeTrailingSlashes(file);
}
exports.normalizePath = normalizePath;
function isPackageJson(file) {
    return path_1.default.basename(file) === 'package.json';
}
exports.isPackageJson = isPackageJson;
function isDotJS(file) {
    return path_1.default.extname(file) === '.js';
}
exports.isDotJS = isDotJS;
function isDotJSON(file) {
    return path_1.default.extname(file) === '.json';
}
exports.isDotJSON = isDotJSON;
function isDotNODE(file) {
    return path_1.default.extname(file) === '.node';
}
exports.isDotNODE = isDotNODE;
function replaceSlashes(file, slash) {
    if (/^.:\\/.test(file)) {
        if (slash === '/') {
            return file.slice(2).replace(/\\/g, '/');
        }
    }
    else if (/^\//.test(file)) {
        if (slash === '\\') {
            return `C:${file.replace(/\//g, '\\')}`;
        }
    }
    return file;
}
function injectSnapshot(file) {
    if (/^.:\\/.test(file)) {
        // C:\path\to
        if (file.length === 3) {
            // C:\
            file = file.slice(0, -1);
        }
        // by convention, on windows we use C:\\snapshot
        return `C:\\snapshot${file.slice(2)}`;
    }
    if (/^\//.test(file)) {
        // /home/user/project
        if (file.length === 1) {
            // /
            file = file.slice(0, -1);
        }
        return `/snapshot${file}`;
    }
    return file;
}
function longestCommonLength(s1, s2) {
    const length = Math.min(s1.length, s2.length);
    for (let i = 0; i < length; i += 1) {
        if (s1.charCodeAt(i) !== s2.charCodeAt(i)) {
            return i;
        }
    }
    return length;
}
function withoutNodeModules(file) {
    return file.split(`${path_1.default.sep}node_modules${path_1.default.sep}`)[0];
}
function retrieveDenominator(files) {
    (0, assert_1.default)(files.length > 0);
    let s1 = withoutNodeModules(files[0]) + path_1.default.sep;
    for (let i = 1; i < files.length; i += 1) {
        const s2 = withoutNodeModules(files[i]) + path_1.default.sep;
        s1 = s1.slice(0, longestCommonLength(s1, s2));
    }
    if (s1 === '') {
        return win32 ? 2 : 0;
    }
    return s1.lastIndexOf(path_1.default.sep);
}
exports.retrieveDenominator = retrieveDenominator;
function substituteDenominator(f, denominator) {
    const rootLength = win32 ? 2 : 0;
    return f.slice(0, rootLength) + f.slice(denominator);
}
exports.substituteDenominator = substituteDenominator;
function snapshotify(file, slash) {
    return injectSnapshot(replaceSlashes(file, slash));
}
exports.snapshotify = snapshotify;
function insideSnapshot(f) {
    f = pathToString(f, win32);
    if (typeof f !== 'string') {
        return false;
    }
    if (win32) {
        const slice112 = f.slice(1, 12);
        return (slice112 === ':\\snapshot\\' ||
            slice112 === ':/snapshot\\' ||
            slice112 === ':\\snapshot/' ||
            slice112 === ':/snapshot/' ||
            slice112 === ':\\snapshot' ||
            slice112 === ':/snapshot');
    }
    const slice010 = f.slice(0, 10);
    return slice010 === '/snapshot/' || slice010 === '/snapshot';
}
exports.insideSnapshot = insideSnapshot;
function stripSnapshot(f) {
    const file = normalizePath(f);
    if (/^.:\\snapshot$/.test(file)) {
        return `${file[0]}:\\**\\`;
    }
    if (/^.:\\snapshot\\/.test(file)) {
        return `${file[0]}:\\**${file.slice(11)}`;
    }
    if (/^\/snapshot$/.test(file)) {
        return '/**/';
    }
    if (/^\/snapshot\//.test(file)) {
        return `/**${file.slice(9)}`;
    }
    return f; // not inside
}
exports.stripSnapshot = stripSnapshot;
function removeUplevels(f) {
    if (win32) {
        while (true) {
            if (f.slice(0, 3) === '..\\') {
                f = f.slice(3);
            }
            else if (f === '..') {
                f = '.';
            }
            else {
                break;
            }
        }
        return f;
    }
    while (true) {
        if (f.slice(0, 3) === '../') {
            f = f.slice(3);
        }
        else if (f === '..') {
            f = '.';
        }
        else {
            break;
        }
    }
    return f;
}
exports.removeUplevels = removeUplevels;
function toNormalizedRealPath(requestPath) {
    const file = normalizePath(requestPath);
    if (fs_1.default.existsSync(file)) {
        return fs_1.default.realpathSync(file);
    }
    return file;
}
exports.toNormalizedRealPath = toNormalizedRealPath;
//# sourceMappingURL=common.js.map
},
{"0/1/2/3/4/5":{"1":[0,5226279],"3":[5226279,108]},"0/1/2/3/6/7/8":{"1":[5226387,353],"3":[5226740,103]},"0/1/2/9/a/b/c":{"1":[5226843,679],"3":[5227522,104]},"0/1/2/9/a/b/d":{"1":[5227626,783],"3":[5228409,104]},"0/1/2/9/a/b/8":{"1":[5228513,957],"3":[5229470,104]},"0/1/2/9/a/b/e":{"1":[5229574,4155],"3":[5233729,105]},"0/1/2/9/a/b/f/g":{"1":[5233834,800],"3":[5234634,102]},"0/1/2/9/a/b/f/h":{"1":[5234736,3550],"3":[5238286,105]},"0/1/2/9/a/b/f/i":{"1":[5238391,2567],"3":[5240958,105]},"0/1/2/9/a/b/f/j":{"1":[5241063,678],"3":[5241741,100]},"0/1/2/9/a/b/k/l":{"1":[5241841,465],"3":[5242306,104]},"0/1/2/9/a/b/k/m":{"1":[5242410,154],"3":[5242564,103]},"0/1/2/9/a/b/k/n":{"1":[5242667,3205382],"3":[8448049,105]},"0/1/2/9/a/b/k/o":{"1":[8448154,837],"3":[8448991,102]},"0/1/2/9/a/b/p/q":{"1":[8449093,76],"3":[8449169,102]},"0/1/2/9/a/b/p/r":{"1":[8449271,1475],"3":[8450746,104]},"0/1/2/9/a/b/p/s":{"1":[8450850,1706],"3":[8452556,104]},"0/1/2/9/a/b/p/t":{"1":[8452660,562],"3":[8453222,104]},"0/1/2/9/a/b/u/v":{"1":[8453326,738],"3":[8454064,104]},"0/1/2/9/a/b/u/w":{"1":[8454168,3251],"3":[8457419,105]},"0/1/2/9/a/b/u/x":{"1":[8457524,2317],"3":[8459841,104]},"0/1/2/9/a/b/u/y":{"1":[8459945,4040],"3":[8463985,105]},"0/1/2/9/a/b/u/z":{"1":[8464090,1480],"3":[8465570,104]},"0/1/2/9/a/b/u/10":{"1":[8465674,354],"3":[8466028,103]},"0/1/2/9/a/b/u/11":{"1":[8466131,2158],"3":[8468289,105]},"0/1/2/9/a/b/u/12":{"1":[8468394,1236],"3":[8469630,104]},"0/1/2/9/a/b/u/13":{"1":[8469734,5578],"3":[8475312,105]},"0/1/2/9/a/b/u/14":{"1":[8475417,1915],"3":[8477332,104]},"0/1/2/9/a/b/u/15":{"1":[8477436,166],"3":[8477602,101]},"0/1/2/9/a/b/f/k/16":{"1":[8477703,2270],"3":[8479973,105]},"0/1/2/9/a/b/f/k/17":{"1":[8480078,732],"3":[8480810,104]},"0/1/2/9/a/b/f/k/18":{"1":[8480914,462],"3":[8481376,104]},"0/1/2/9/a/b/f/k/19":{"1":[8481480,2355],"3":[8483835,105]},"0/1/2/9/a/b/f/k/1a":{"1":[8483940,827],"3":[8484767,102]},"0/1/2/9/a/b/f/1b/1c":{"1":[8484869,524],"3":[8485393,104]},"0/1/2/9/a/b/f/1b/1d":{"1":[8485497,4251470],"3":[12736967,108]},"0/1/2/9/a/b/f/1b/1e":{"1":[12737075,764188],"3":[13501263,107]},"0/1/2/9/a/b/f/1b/1f":{"1":[13501370,607],"3":[13501977,104]},"0/1/2/9/a/b/f/1b/1g":{"1":[13502081,918543],"3":[14420624,107]},"0/1/2/9/a/b/f/1b/1h":{"1":[14420731,918543],"3":[15339274,107]},"0/1/2/9/a/b/f/1b/1i":{"1":[15339381,2800699],"3":[18140080,107]},"0/1/2/9/a/b/f/1b/1j":{"1":[18140187,27457],"3":[18167644,105]},"0/1/2/9/a/b/f/1b/1k":{"1":[18167749,1802625],"3":[19970374,107]},"0/1/2/9/a/b/a/1l/1m":{"1":[19970481,1494],"3":[19971975,104]},"0/1/2/9/a/b/a/1l/5":{"1":[19972079,4921],"3":[19977000,105]},"0/1/2/9/a/b/a/1l/1n":{"1":[19977105,4915],"3":[19982020,105]},"0/1/2/9/a/b/a/1l/d":{"1":[19982125,516],"3":[19982641,103]},"0/1/2/9/a/b/a/1l/8":{"1":[19982744,740],"3":[19983484,104]},"0/1/2/9/a/b/a/1l/e":{"1":[19983588,8800],"3":[19992388,105]},"0/1/2/9/a/b/a/1o/1p":{"1":[19992493,367],"3":[19992860,103]},"0/1/2/9/a/b/a/1o/1q":{"1":[19992963,315],"3":[19993278,103]},"0/1/2/9/a/b/a/1o/5":{"1":[19993381,247],"3":[19993628,101]},"0/1/2/9/a/b/a/1o/1r":{"1":[19993729,703],"3":[19994432,104]},"0/1/2/9/a/b/a/1o/1s":{"1":[19994536,674],"3":[19995210,104]},"0/1/2/9/a/b/a/1o/1t":{"1":[19995314,26297],"3":[20021611,106]},"0/1/2/9/a/b/a/1o/1u":{"1":[20021717,17678],"3":[20039395,106]},"0/1/2/9/a/b/a/1o/1v":{"1":[20039501,234],"3":[20039735,103]},"0/1/2/9/a/b/a/1o/1w":{"1":[20039838,109],"3":[20039947,103]},"0/1/2/9/a/b/a/1o/1x":{"1":[20040050,355],"3":[20040405,103]},"0/1/2/9/a/b/a/1o/1y":{"1":[20040508,20],"3":[20040528,101]},"0/1/2/9/a/b/a/1o/1z":{"1":[20040629,239],"3":[20040868,103]},"0/1/2/9/a/b/a/1o/8":{"1":[20040971,2392],"3":[20043363,105]},"0/1/2/9/a/b/a/1o/e":{"1":[20043468,4563],"3":[20048031,105]},"0/1/2/9/a/b/a/20/5":{"1":[20048136,236],"3":[20048372,103]},"0/1/2/9/a/b/a/20/d":{"1":[20048475,494],"3":[20048969,103]},"0/1/2/9/a/b/a/20/8":{"1":[20049072,635],"3":[20049707,104]},"0/1/2/9/a/b/a/20/e":{"1":[20049811,10335],"3":[20060146,105]},"0/1/2/9/a/b/f/a/1o/21":{"1":[20060251,354],"3":[20060605,103]},"0/1/2/9/a/b/f/a/1o/22":{"1":[20060708,2139],"3":[20062847,105]},"0/1/2/9/a/b/f/a/1o/23":{"1":[20062952,692],"3":[20063644,102]},"0/1/2/9/a/b/a/1o/24/25":{"1":[20063746,1274],"3":[20065020,102]},"0/1/2/9/a/b/a/1o/24/26":{"1":[20065122,913],"3":[20066035,104]},"0/1/2/9/a/b/a/1o/24/27":{"1":[20066139,4124],"3":[20070263,105]},"0/1/2/9/a/b/a/1o/24/28":{"1":[20070368,922],"3":[20071290,104]},"0/1/2/9/a/b/a/1o/24/e":{"1":[20071394,1369],"3":[20072763,102]},"0/1/2/9/a/b/a/20/p/29":{"1":[20072865,767],"3":[20073632,104]},"0/1/2/9/a/b/a/20/p/m":{"1":[20073736,1006],"3":[20074742,104]},"0/1/2/9/a/b/a/20/p/2a":{"1":[20074846,552],"3":[20075398,103]},"0/1/2/9/a/b/a/20/p/2b":{"1":[20075501,2758],"3":[20078259,104]},"0/1/2/9/a/b/a/20/p/2c":{"1":[20078363,376],"3":[20078739,103]},"0/1/2/9/a/b/a/20/p/2d":{"1":[20078842,718],"3":[20079560,104]},"0/1/2/9/a/b/a/20/p/2e":{"1":[20079664,1211],"3":[20080875,102]},"0/1/2/9/a/b/a/20/p/2f":{"1":[20080977,1497],"3":[20082474,104]},"0/1/2/9/a/b/a/20/p/2g":{"1":[20082578,342],"3":[20082920,103]},"0/1/2/9/a/b/a/20/p/2h":{"1":[20083023,273],"3":[20083296,103]},"0/1/2/9/a/b/a/20/p/2i":{"1":[20083399,276],"3":[20083675,103]},"0/1/2/9/a/b/a/20/p/2j":{"1":[20083778,2826],"3":[20086604,105]},"0/1/2/9/a/b/a/20/p/2k":{"1":[20086709,4764],"3":[20091473,105]},"0/1/2/9/a/b/a/20/p/2l":{"1":[20091578,1648],"3":[20093226,104]},"0/1/2/9/a/b/a/20/p/2m":{"1":[20093330,1534],"3":[20094864,104]},"0/1/2/9/a/b/a/20/p/2n":{"1":[20094968,1077],"3":[20096045,104]},"0/1/2/9/a/b/a/20/p/2o":{"1":[20096149,1713],"3":[20097862,104]},"0/1/2/9/a/b/a/20/p/2p":{"1":[20097966,493],"3":[20098459,103]},"0/1/2/9/a/b/a/20/p/2q":{"1":[20098562,265],"3":[20098827,101]},"0/1/2/9/a/b/a/20/p/2r":{"1":[20098928,550],"3":[20099478,104]},"0/1/2/9/a/b/a/20/p/2s":{"1":[20099582,7395],"3":[20106977,105]},"0/1/2/9/a/b/a/20/p/2t":{"1":[20107082,436],"3":[20107518,103]},"0/1/2/9/a/b/a/20/p/2u":{"1":[20107621,303],"3":[20107924,103]},"0/1/2/9/a/b/a/20/p/2v":{"1":[20108027,312],"3":[20108339,103]},"0/1/2/9/a/b/a/20/p/2w":{"1":[20108442,3763],"3":[20112205,105]},"0/1/2/9/a/b/f/1b/2x/2y/2z":{"1":[20112310,246],"3":[20112556,103]},"0/1/2/9/a/b/f/1b/2x/2y/30":{"1":[20112659,26614],"3":[20139273,105]},"0/1/2/9/a/b/f/k/1b/2x/31/32":{"1":[20139378,230],"3":[20139608,100]},"0/1/2/9/a/b/f/k/1b/2x/b/33":{"1":[20139708,230],"3":[20139938,100]},"0/1/2/9/a/b/f/k/1b/2x/b/30":{"1":[20140038,26556],"3":[20166594,103]},"0/1/2/9/a/b/f/1b/2x/34/35/36":{"1":[20166697,89887],"3":[20256584,102]},"0/1/2/9/a/b/f/1b/2x/34/35/37":{"1":[20256686,3091],"3":[20259777,104]},"0/1/2/9/a/b/f/1b/2x/34/35/38":{"1":[20259881,14805],"3":[20274686,105]},"0/1/2/9/a/b/f/1b/2x/34/35/39":{"1":[20274791,10991],"3":[20285782,101]},"0/1/2/9/a/b/f/1b/2x/34/35/3a":{"1":[20285883,105061],"3":[20390944,106]},"0/1/2/9/a/b/f/1b/2x/34/35/3b":{"1":[20391050,2198],"3":[20393248,104]},"0/1/2/9/a/b/f/1b/2x/34/35/3c":{"1":[20393352,7746],"3":[20401098,105]},"0/1/2/9/a/b/f/1b/2x/34/35/3d":{"1":[20401203,5881],"3":[20407084,105]},"0/1/2/9/a/b/f/1b/2x/34/35/3e":{"1":[20407189,5793],"3":[20412982,105]},"0/1/2/9/a/b/f/1b/2x/34/35/3f":{"1":[20413087,84208],"3":[20497295,104]},"0/1/2/9/a/b/f/1b/2x/34/35/3g":{"1":[20497399,395],"3":[20497794,103]},"0/1/2/9/a/b/f/1b/2x/34/35/3h":{"1":[20497897,363],"3":[20498260,103]},"0/1/2/9/a/b/f/1b/2x/34/35/3i":{"1":[20498363,9862],"3":[20508225,103]},"0/1/2/9/a/b/f/1b/2x/34/35/3j":{"1":[20508328,8041],"3":[20516369,105]},"0/1/2/9/a/b/f/1b/2x/34/35/3k":{"1":[20516474,2633],"3":[20519107,104]},"0/1/2/9/a/b/f/1b/2x/34/35/3l":{"1":[20519211,1352],"3":[20520563,102]},"0/1/2/9/a/b/f/1b/2x/34/35/3m":{"1":[20520665,2100],"3":[20522765,104]},"0/1/2/9/a/b/f/1b/2x/34/35/3n":{"1":[20522869,234888],"3":[20757757,106]},"0/1/2/9/a/b/f/1b/2x/34/35/3o":{"1":[20757863,2051],"3":[20759914,104]},"0/1/2/9/a/b/f/1b/2x/34/35/3p":{"1":[20760018,2294239],"3":[23054257,107]},"0/1/2/9/a/b/f/1b/2x/34/35/3q":{"1":[23054364,165133],"3":[23219497,106]},"0/1/2/9/a/b/f/1b/2x/34/35/3r":{"1":[23219603,209],"3":[23219812,103]},"0/1/2/9/a/b/f/1b/2x/34/35/3s":{"1":[23219915,906],"3":[23220821,104]},"0/1/2/9/a/b/f/1b/2x/34/35/3t":{"1":[23220925,6628],"3":[23227553,103]},"0/1/2/9/a/b/f/1b/2x/34/35/3u":{"1":[23227656,76],"3":[23227732,102]},"0/1/2/9/a/b/f/1b/2x/2y/3v/3w":{"1":[23227834,1110],"3":[23228944,105]},"0/1/2/9/a/b/f/1b/2x/2y/3v/3x":{"1":[23229049,9286],"3":[23238335,106]},"0/1/2/9/a/b/f/1b/2x/2y/3v/3y":{"1":[23238441,225],"3":[23238666,104]},"0/1/2/9/a/b/f/1b/2x/2y/3v/3z":{"1":[23238770,625],"3":[23239395,102]},"0/1/2/9/a/b/f/1b/2x/2y/3v/40":{"1":[23239497,637],"3":[23240134,104]},"0/1/2/9/a/b/f/1b/2x/2y/3v/41":{"1":[23240238,220],"3":[23240458,104]},"0/1/2/9/a/b/f/1b/2x/2y/3v/42":{"1":[23240562,176],"3":[23240738,103]},"0/1/2/9/a/b/f/1b/2x/2y/3v/43":{"1":[23240841,159],"3":[23241000,103]},"0/1/2/9/a/b/f/1b/2x/2y/u/44":{"1":[23241103,532023],"3":[23773126,107]},"0/1/2/9/a/b/f/1b/2x/2y/u/45":{"1":[23773233,578698],"3":[24351931,107]},"0/1/2/9/a/b/f/1b/2x/2y/u/46":{"1":[24352038,549931],"3":[24901969,107]},"0/1/2/9/a/b/f/1b/2x/2y/u/47":{"1":[24902076,597734],"3":[25499810,107]},"0/1/2/9/a/b/f/k/1b/2x/31/48/49":{"1":[25499917,176],"3":[25500093,103]},"0/1/2/9/a/b/f/k/1b/2x/31/48/4a":{"1":[25500196,264],"3":[25500460,101]},"0/1/2/9/a/b/f/k/1b/2x/31/48/4b":{"1":[25500561,104],"3":[25500665,102]},"0/1/2/9/a/b/f/k/1b/2x/31/48/4c":{"1":[25500767,141],"3":[25500908,103]},"0/1/2/9/a/b/f/k/1b/2x/b/4d/3w":{"1":[25501011,896],"3":[25501907,104]},"0/1/2/9/a/b/f/k/1b/2x/b/4d/3x":{"1":[25502011,2072],"3":[25504083,105]},"0/1/2/9/a/b/f/k/1b/2x/b/4d/3y":{"1":[25504188,227],"3":[25504415,103]},"0/1/2/9/a/b/f/k/1b/2x/b/4d/4e":{"1":[25504518,260],"3":[25504778,104]},"0/1/2/9/a/b/f/k/1b/2x/b/4d/4f":{"1":[25504882,207],"3":[25505089,101]},"0/1/2/9/a/b/f/k/1b/2x/b/4d/4g":{"1":[25505190,266],"3":[25505456,104]},"0/1/2/9/a/b/f/k/1b/2x/b/4d/4h":{"1":[25505560,176],"3":[25505736,103]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4j":{"1":[25505839,135],"3":[25505974,103]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/30":{"1":[25506077,26334],"3":[25532411,105]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/36":{"1":[25532516,140],"3":[25532656,103]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/3a":{"1":[25532759,59804],"3":[25592563,106]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/3b":{"1":[25592669,2827],"3":[25595496,104]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4l":{"1":[25595600,180],"3":[25595780,103]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/3i":{"1":[25595883,5133],"3":[25601016,105]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4m":{"1":[25601121,199],"3":[25601320,100]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4n":{"1":[25601420,697],"3":[25602117,104]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4o/3w":{"1":[25602221,761],"3":[25602982,104]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4o/3x":{"1":[25603086,1177],"3":[25604263,105]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4o/3y":{"1":[25604368,199],"3":[25604567,103]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4o/4e":{"1":[25604670,242],"3":[25604912,104]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4o/4f":{"1":[25605016,185],"3":[25605201,103]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4o/4g":{"1":[25605304,246],"3":[25605550,104]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4o/4p":{"1":[25605654,176],"3":[25605830,103]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4q/4r":{"1":[25605933,326],"3":[25606259,103]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4s/4t":{"1":[25606362,32083],"3":[25638445,106]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4u/3e":{"1":[25638551,5441],"3":[25643992,105]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4u/4v":{"1":[25644097,30046],"3":[25674143,106]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4w/4x":{"1":[25674249,5128],"3":[25679377,105]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4w/4y":{"1":[25679482,6321],"3":[25685803,105]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4w/4z":{"1":[25685908,4700],"3":[25690608,105]},"0/1/2/9/a/b/f/k/1b/2x/b/2x/34/35/50":{"1":[25690713,1720304],"3":[27411017,107]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/a/1o/51":{"1":[27411124,1480],"3":[27412604,104]},"0/1/2/3/4/52":{"1":[27412708,74590],"3":[27487298,106]},"0/1/2/3/4/53/54":{"1":[27487404,195960],"3":[27683364,107]},"0/1/2/3/4/53/55":{"1":[27683471,96124],"3":[27779595,106]},"0/1/2/3/4/53/56":{"1":[27779701,387845],"3":[28167546,107]},"0/1/2/3/4/53/57":{"1":[28167653,17550],"3":[28185203,105]},"0/1/2/3/4/53/58":{"1":[28185308,269254],"3":[28454562,105]},"0/1/2/3/4/53/59":{"1":[28454667,8850],"3":[28463517,105]},"0/1/2/3/4/53/5a":{"1":[28463622,196468],"3":[28660090,107]},"0/1/2/3/4/53/5b":{"1":[28660197,35314],"3":[28695511,106]},"0/1/2/3/4/53/5c":{"1":[28695617,1955],"3":[28697572,104]},"0/1/2/3/4/53/5d":{"1":[28697676,51997],"3":[28749673,106]},"0/1/2/3/4/53/5e":{"1":[28749779,6673],"3":[28756452,105]},"0/1/2/3/4/53/5f":{"1":[28756557,57141],"3":[28813698,106]},"0/1/2/3/4/53/5g":{"1":[28813804,81145],"3":[28894949,106]},"0/1/2/3/4/53/5h":{"1":[28895055,2372],"3":[28897427,104]},"0/1/2/3/4/53/5i":{"1":[28897531,334385],"3":[29231916,107]},"0/1/2/3/4/53/5j":{"1":[29232023,11096],"3":[29243119,105]},"0/1/2/3/4/53/5k":{"1":[29243224,434097],"3":[29677321,107]},"0/1/2/3/4/53/5l":{"1":[29677428,537735],"3":[30215163,107]},"0/1/2/3/4/53/5m":{"1":[30215270,89990],"3":[30305260,106]},"0/1/2/3/4/53/5n":{"1":[30305366,73443],"3":[30378809,106]},"0/1/2/3/4/53/5o":{"1":[30378915,40432],"3":[30419347,106]},"0/1/2/3/4/53/5p":{"1":[30419453,83070],"3":[30502523,106]},"0/1/2/3/4/53/5q":{"1":[30502629,174151],"3":[30676780,107]},"0/1/2/3/4/53/5r":{"1":[30676887,102641],"3":[30779528,106]},"0/1/2/3/4/53/5s":{"1":[30779634,45179],"3":[30824813,106]},"0/1/2/3/4/53/5t":{"1":[30824919,44690],"3":[30869609,106]},"0/1/2/3/4/53/5u":{"1":[30869715,314120],"3":[31183835,105]},"0/1/2/3/4/53/5v":{"1":[31183940,16817],"3":[31200757,105]},"0/1/2/3/4/53/5w":{"1":[31200862,264699],"3":[31465561,107]},"0/1/2/3/4/53/5x":{"1":[31465668,7869],"3":[31473537,105]},"0/1/2/3/4/53/5y":{"1":[31473642,226590],"3":[31700232,107]},"0/1/2/3/4/53/5z":{"1":[31700339,219609],"3":[31919948,107]},"0/1/2/3/4/53/60":{"1":[31920055,8705],"3":[31928760,105]},"0/1/2/3/4/53/61":{"1":[31928865,35485],"3":[31964350,106]},"0/1/2/3/4/53/62":{"1":[31964456,54348],"3":[32018804,106]},"0/1/2/3/63/64/65":{"1":[32018910,171],"3":[32019081,103]},"0/1/2/3/63/64/66":{"1":[32019184,136],"3":[32019320,101]},"0/1/2/3/63/64/67":{"1":[32019421,178],"3":[32019599,103]},"0/1/2/3/63/64/68":{"1":[32019702,140],"3":[32019842,103]},"0/1/2/3/63/64/69":{"1":[32019945,327],"3":[32020272,103]},"0/1/2/3/63/64/6a":{"1":[32020375,241],"3":[32020616,103]},"0/1/2/3/63/64/6b":{"1":[32020719,151],"3":[32020870,101]},"0/1/2/3/63/64/6c":{"1":[32020971,128],"3":[32021099,101]},"0/1/2/3/63/64/6d":{"1":[32021200,118],"3":[32021318,103]},"0/1/2/3/63/64/6e":{"1":[32021421,86],"3":[32021507,103]},"0/1/2/3/63/64/6f":{"1":[32021610,89],"3":[32021699,103]},"0/1/2/3/63/64/6g":{"1":[32021802,225],"3":[32022027,103]},"0/1/2/3/63/64/6h":{"1":[32022130,20],"3":[32022150,101]},"0/1/2/3/63/64/6i":{"1":[32022251,123],"3":[32022374,103]},"0/1/2/3/63/64/6j":{"1":[32022477,142],"3":[32022619,103]},"0/1/2/3/63/6k/66":{"1":[32022722,138],"3":[32022860,103]},"0/1/2/3/63/6k/6b":{"1":[32022963,74],"3":[32023037,102]},"0/1/2/3/63/6k/6f":{"1":[32023139,125],"3":[32023264,103]},"0/1/2/3/63/6k/6j":{"1":[32023367,108],"3":[32023475,103]},"0/1/2/3/63/6l/6m/6n":{"1":[32023578,126],"3":[32023704,103]},"0/1/2/3/63/6l/6o/6p":{"1":[32023807,149],"3":[32023956,103]},"0/1/2/3/63/6l/6q/6r":{"1":[32024059,128],"3":[32024187,103]},"0/1/2/3/63/6l/6s/6t":{"1":[32024290,103],"3":[32024393,103]},"0/1/2/3/63/6l/6s/6n":{"1":[32024496,125],"3":[32024621,103]},"0/1/2/3/63/6l/6s/6r":{"1":[32024724,125],"3":[32024849,103]},"0/1/2/3/63/6l/6u/6v":{"1":[32024952,551],"3":[32025503,104]},"0/1/2/3/63/6l/6u/6n":{"1":[32025607,617],"3":[32026224,104]},"0/1/2/3/63/6l/6w/6x":{"1":[32026328,230],"3":[32026558,104]},"0/1/2/3/63/6l/6w/6t":{"1":[32026662,317],"3":[32026979,104]},"0/1/2/3/63/6l/6w/6p":{"1":[32027083,233],"3":[32027316,104]},"0/1/2/3/63/6l/6w/6y":{"1":[32027420,237],"3":[32027657,104]},"0/1/2/3/63/6l/6w/6z":{"1":[32027761,231],"3":[32027992,104]},"0/1/2/3/63/70/71/6j":{"1":[32028096,542],"3":[32028638,104]},"0/1/2/3/63/70/72/73":{"1":[32028742,250],"3":[32028992,103]},"0/1/2/3/63/70/74/75":{"1":[32029095,199],"3":[32029294,101]},"0/1/2/3/63/70/74/76":{"1":[32029395,117],"3":[32029512,103]},"0/1/2/3/a/77/p/78":{"1":[32029615,51485],"3":[32081100,105]},"0/1/2/3/a/77/p/79":{"1":[32081205,60143],"3":[32141348,106]},"0/1/2/3/a/77/p/7a":{"1":[32141454,46664],"3":[32188118,105]},"0/1/2/3/4/7b":{"1":[32188223,380102],"3":[32568325,106]},"0/1/2/3/4/7c":{"1":[32568431,158],"3":[32568589,103]},"0/1/2/3/4/7d":{"1":[32568692,5238],"3":[32573930,105]},"0/1/2/3/4/7e":{"1":[32574035,195],"3":[32574230,101]},"0/1/2/3/4/8":{"1":[32574331,106],"3":[32574437,103]},"0/1/2/3/4":{"2":[32574540,120],"3":[32574660,102]},"0/1/2/3/6/7":{"2":[32574762,36],"3":[32574798,102]},"0/1/2/9/a/b":{"2":[32574900,105],"3":[32575005,102]},"0/1/2/9/a/b/f":{"2":[32575107,103],"3":[32575210,102]},"0/1/2/9/a/b/k":{"2":[32575312,89],"3":[32575401,102]},"0/1/2/9/a/b/p":{"2":[32575503,59],"3":[32575562,102]},"0/1/2/9/a/b/u":{"2":[32575664,113],"3":[32575777,102]},"0/1/2/9/a/b/f/k":{"2":[32575879,92],"3":[32575971,102]},"0/1/2/9/a/b/f/1b":{"2":[32576073,81],"3":[32576154,102]},"0/1/2/9/a/b/a/1l":{"2":[32576256,77],"3":[32576333,102]},"0/1/2/9/a/b/a/1o":{"2":[32576435,152],"3":[32576587,102]},"0/1/2/9/a/b/a/20":{"2":[32576689,75],"3":[32576764,102]},"0/1/2/9/a/b/f/a/1o":{"2":[32576866,74],"3":[32576940,102]},"0/1/2/9/a/b/a/1o/24":{"2":[32577042,81],"3":[32577123,102]},"0/1/2/9/a/b/a/20/p":{"2":[32577225,210],"3":[32577435,102]},"0/1/2/9/a/b/f/1b/2x/2y":{"2":[32577537,86],"3":[32577623,102]},"0/1/2/9/a/b/f/k/1b/2x/31":{"2":[32577725,68],"3":[32577793,102]},"0/1/2/9/a/b/f/k/1b/2x/b":{"2":[32577895,80],"3":[32577975,102]},"0/1/2/9/a/b/f/1b/2x/34/35":{"2":[32578077,192],"3":[32578269,102]},"0/1/2/9/a/b/f/1b/2x/2y/3v":{"2":[32578371,104],"3":[32578475,102]},"0/1/2/9/a/b/f/1b/2x/2y/u":{"2":[32578577,70],"3":[32578647,102]},"0/1/2/9/a/b/f/k/1b/2x/31/48":{"2":[32578749,93],"3":[32578842,102]},"0/1/2/9/a/b/f/k/1b/2x/b/4d":{"2":[32578944,95],"3":[32579039,102]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i":{"2":[32579141,87],"3":[32579228,102]},"0/1/2/9/a/b/f/1b/2x/34/35/4k":{"2":[32579330,122],"3":[32579452,102]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/4o":{"2":[32579554,95],"3":[32579649,102]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4q":{"2":[32579751,33],"3":[32579784,102]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4s":{"2":[32579886,36],"3":[32579922,102]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4u":{"2":[32580024,43],"3":[32580067,102]},"0/1/2/9/a/b/f/1b/2x/34/35/4k/4w":{"2":[32580169,52],"3":[32580221,102]},"0/1/2/9/a/b/f/k/1b/2x/b/2x/34/35":{"2":[32580323,35],"3":[32580358,102]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/a/1o":{"2":[32580460,35],"3":[32580495,102]},"0/1/2/3/4/53":{"2":[32580597,202],"3":[32580799,102]},"0/1/2/3/63/64":{"2":[32580901,103],"3":[32581004,102]},"0/1/2/3/63/6k":{"2":[32581106,58],"3":[32581164,102]},"0/1/2/3/63/6l/6m":{"2":[32581266,44],"3":[32581310,102]},"0/1/2/3/63/6l/6o":{"2":[32581412,45],"3":[32581457,102]},"0/1/2/3/63/6l/6q":{"2":[32581559,46],"3":[32581605,102]},"0/1/2/3/63/6l/6s":{"2":[32581707,70],"3":[32581777,102]},"0/1/2/3/63/6l/6u":{"2":[32581879,53],"3":[32581932,102]},"0/1/2/3/63/6l/6w":{"2":[32582034,90],"3":[32582124,102]},"0/1/2/3/63/70/71":{"2":[32582226,38],"3":[32582264,102]},"0/1/2/3/63/70/72":{"2":[32582366,59],"3":[32582425,102]},"0/1/2/3/63/70/74":{"2":[32582527,83],"3":[32582610,102]},"0/1/2/3/a/77/p":{"2":[32582712,58],"3":[32582770,102]},"0/1/2/3":{"2":[32582872,66],"3":[32582938,102]},"0/1/2/3/6":{"2":[32583040,33],"3":[32583073,102]},"0/1/2/9/a":{"2":[32583175,31],"3":[32583206,102]},"0/1/2/9/a/b/a":{"2":[32583308,55],"3":[32583363,102]},"0/1/2/9/a/b/f/a":{"2":[32583465,38],"3":[32583503,102]},"0/1/2/9/a/b/f/1b/2x":{"2":[32583605,58],"3":[32583663,102]},"0/1/2/9/a/b/f/k/1b/2x":{"2":[32583765,53],"3":[32583818,102]},"0/1/2/9/a/b/f/1b/2x/34":{"2":[32583920,47],"3":[32583967,102]},"0/1/2/9/a/b/f/a/1o/1b/2x":{"2":[32584069,31],"3":[32584100,102]},"0/1/2/9/a/b/f/k/1b/2x/b/2x/34":{"2":[32584202,47],"3":[32584249,102]},"0/1/2/9/a/b/f/a/1o/1b/2x/4i/a":{"2":[32584351,38],"3":[32584389,102]},"0/1/2/3/63":{"2":[32584491,79],"3":[32584570,102]},"0/1/2/3/63/6l":{"2":[32584672,65],"3":[32584737,102]},"0/1/2/3/63/70":{"2":[32584839,62],"3":[32584901,102]},"0/1/2/3/a/77":{"2":[32585003,27],"3":[32585030,102]},"0/1/2":{"2":[32585132,37],"3":[32585169,102]},"0/1/2/9":{"2":[32585271,36],"3":[32585307,102]},"0/1/2/9/a/b/f/k/1b":{"2":[32585409,27],"3":[32585436,102]},"0/1/2/9/a/b/f/a/1o/1b":{"2":[32585538,27],"3":[32585565,102]},"0/1/2/9/a/b/f/k/1b/2x/b/2x":{"2":[32585667,43],"3":[32585710,102]},"0/1/2/3/a":{"2":[32585812,30],"3":[32585842,102]},"0/1":{"2":[32585944,37],"3":[32585981,102]}}
,
"C:\\snapshot\\gamecowork\\binary\\out\\index.js"
,
{}
,
{"C:":"0","snapshot":"1","gamecowork":"2","binary":"3","out":"4","index.js":"5","pkgJson":"6","win32-x64":"7","package.json":"8","core":"9","node_modules":"a","sqlite3":"b","binding.gyp":"c","LICENSE":"d","README.md":"e","build":"f","binding.sln":"g","config.gypi":"h","node_sqlite3.vcxproj":"i","node_sqlite3.vcxproj.filters":"j","deps":"k","common-sqlite.gypi":"l","extract.js":"m","sqlite-autoconf-3440200.tar.gz":"n","sqlite3.gyp":"o","lib":"p","sqlite3-binding.js":"q","sqlite3.d.ts":"r","sqlite3.js":"s","trace.js":"t","src":"u","async.h":"v","backup.cc":"w","backup.h":"x","database.cc":"y","database.h":"z","gcc-preinclude.h":"10","macros.h":"11","node_sqlite3.cc":"12","statement.cc":"13","statement.h":"14","threading.h":"15","action_before_build.vcxproj":"16","action_before_build.vcxproj.filters":"17","sqlite3.sln":"18","sqlite3.vcxproj":"19","sqlite3.vcxproj.filters":"1a","Release":"1b","node_sqlite3.exp":"1c","node_sqlite3.iobj":"1d","node_sqlite3.ipdb":"1e","node_sqlite3.lib":"1f","node_sqlite3.node":"1g","node_sqlite3.node.bak":"1h","node_sqlite3.pdb":"1i","nothing.lib":"1j","sqlite3.lib":"1k","minipass":"1l","index.d.ts":"1m","index.mjs":"1n","node-addon-api":"1o","common.gypi":"1p","except.gypi":"1q","LICENSE.md":"1r","napi-inl.deprecated.h":"1s","napi-inl.h":"1t","napi.h":"1u","node_addon_api.gyp":"1v","node_api.gyp":"1w","noexcept.gypi":"1x","nothing.c":"1y","package-support.json":"1z","tar":"20","node_api.sln":"21","nothing.vcxproj":"22","nothing.vcxproj.filters":"23","tools":"24","check-napi.js":"25","clang-format.js":"26","conversion.js":"27","eslint-format.js":"28","create.js":"29","get-write-flag.js":"2a","header.js":"2b","high-level-opt.js":"2c","large-numbers.js":"2d","list.js":"2e","mkdir.js":"2f","mode-fix.js":"2g","normalize-unicode.js":"2h","normalize-windows-path.js":"2i","pack.js":"2j","parse.js":"2k","path-reservations.js":"2l","pax.js":"2m","read-entry.js":"2n","replace.js":"2o","strip-absolute-path.js":"2p","strip-trailing-slashes.js":"2q","types.js":"2r","unpack.js":"2s","update.js":"2t","warn-mixin.js":"2u","winchars.js":"2v","write-entry.js":"2w","obj":"2x","node_sqlite3":"2y","node_sqlite3.node.recipe":"2z","win_delay_load_hook.obj":"30","action_before_build":"31","action_before_build.recipe":"32","sqlite3.lib.recipe":"33","global_intermediate":"34","sqlite-autoconf-3440200":"35","aclocal.m4":"36","compile":"37","config.guess":"38","config.sub":"39","configure":"3a","configure.ac":"3b","depcomp":"3c","INSTALL":"3d","install-sh":"3e","ltmain.sh":"3f","Makefile.am":"3g","Makefile.fallback":"3h","Makefile.in":"3i","Makefile.msc":"3j","missing":"3k","README.txt":"3l","Replace.cs":"3m","shell.c":"3n","sqlite3.1":"3o","sqlite3.c":"3p","sqlite3.h":"3q","sqlite3.pc.in":"3r","sqlite3.rc":"3s","sqlite3ext.h":"3t","sqlite3rc.h":"3u","node_sqlite3.tlog":"3v","CL.command.1.tlog":"3w","CL.read.1.tlog":"3x","CL.write.1.tlog":"3y","link.command.1.tlog":"3z","link.read.1.tlog":"40","link.write.1.tlog":"41","node_sqlite3.lastbuildstate":"42","node_sqlite3.write.1u.tlog":"43","backup.obj":"44","database.obj":"45","node_sqlite3.obj":"46","statement.obj":"47","action_b.A318CF7E.tlog":"48","action_before_build.lastbuildstate":"49","CustomBuild.command.1.tlog":"4a","CustomBuild.read.1.tlog":"4b","CustomBuild.write.1.tlog":"4c","sqlite3.tlog":"4d","Lib-link.read.1.tlog":"4e","Lib-link.write.1.tlog":"4f","Lib.command.1.tlog":"4g","sqlite3.lastbuildstate":"4h","nothing":"4i","nothing.lib.recipe":"4j","tea":"4k","license.terms":"4l","pkgIndex.tcl.in":"4m","README":"4n","nothing.tlog":"4o","nothing.lastbuildstate":"4p","doc":"4q","sqlite3.n":"4r","generic":"4s","tclsqlite3.c":"4t","tclconfig":"4u","tcl.m4":"4v","win":"4w","makefile.vc":"4x","nmakehlp.c":"4y","rules.vc":"4z","sqlite3.obj":"50","nothing.obj":"51","tree-sitter.wasm":"52","tree-sitter-wasms":"53","tree-sitter-bash.wasm":"54","tree-sitter-c.wasm":"55","tree-sitter-cpp.wasm":"56","tree-sitter-css.wasm":"57","tree-sitter-c_sharp.wasm":"58","tree-sitter-elisp.wasm":"59","tree-sitter-elixir.wasm":"5a","tree-sitter-elm.wasm":"5b","tree-sitter-embedded_template.wasm":"5c","tree-sitter-go.wasm":"5d","tree-sitter-html.wasm":"5e","tree-sitter-java.wasm":"5f","tree-sitter-javascript.wasm":"5g","tree-sitter-json.wasm":"5h","tree-sitter-kotlin.wasm":"5i","tree-sitter-lua.wasm":"5j","tree-sitter-objc.wasm":"5k","tree-sitter-ocaml.wasm":"5l","tree-sitter-php.wasm":"5m","tree-sitter-python.wasm":"5n","tree-sitter-ql.wasm":"5o","tree-sitter-rescript.wasm":"5p","tree-sitter-ruby.wasm":"5q","tree-sitter-rust.wasm":"5r","tree-sitter-scala.wasm":"5s","tree-sitter-solidity.wasm":"5t","tree-sitter-swift.wasm":"5u","tree-sitter-systemrdl.wasm":"5v","tree-sitter-tlaplus.wasm":"5w","tree-sitter-toml.wasm":"5x","tree-sitter-tsx.wasm":"5y","tree-sitter-typescript.wasm":"5z","tree-sitter-vue.wasm":"60","tree-sitter-yaml.wasm":"61","tree-sitter-zig.wasm":"62","tree-sitter":"63","code-snippet-queries":"64","c.scm":"65","cpp.scm":"66","c_sharp.scm":"67","elisp.scm":"68","elixir.scm":"69","go.scm":"6a","java.scm":"6b","javascript.scm":"6c","ocaml.scm":"6d","php.scm":"6e","python.scm":"6f","ql.scm":"6g","ruby.scm":"6h","rust.scm":"6i","typescript.scm":"6j","import-queries":"6k","root-path-context-queries":"6l","cpp":"6m","function_definition.scm":"6n","go":"6o","function_declaration.scm":"6p","java":"6q","method_declaration.scm":"6r","php":"6s","class_declaration.scm":"6t","python":"6u","class_definition.scm":"6v","typescript":"6w","arrow_function.scm":"6x","generator_function_declaration.scm":"6y","method_definition.scm":"6z","static-context-queries":"70","hole-queries":"71","relevant-headers-queries":"72","typescript-get-toplevel-headers.scm":"73","relevant-types-queries":"74","typescript-extract-identifiers.scm":"75","typescript-find-typedecl-given-typeidentifier.scm":"76","win-ca":"77","crypt32-ia32.node":"78","crypt32-x64.node":"79","roots.exe":"7a","llamaTokenizer.mjs":"7b","llamaTokenizerWorkerPool.mjs":"7c","projectZipWorker.mjs":"7d","tiktokenWorkerPool.mjs":"7e"}
,
1
);
})