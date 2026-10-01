# Git 快照/恢复子系统（原版 CLI, simple-git）

来源: cli-main.beautified.js — createFileSnapshot/restore/prevChanges stash 全实现;
HANDOFF P1 的 7 个宿主 git 方法(getGitBranches 等)在前端是宿主 API 名, CLI 侧实际能力如下。

```js
class {
            projectRoot;
            fileDiscoveryService;
            constructor(e) {
              ((this.projectRoot = dl.resolve(e)), (this.fileDiscoveryService = new EJ(this.projectRoot)));
            }
            getHistoryDir() {
              let e = ame(this.projectRoot);
              return dl.join(cs(), "history", e);
            }
            async initialize() {
              if (!(await this.verifyGitAvailability()))
                throw Error(
                  "Checkpointing is enabled, but Git is not installed. Please install Git or disable checkpointing to continue.",
                );
              this.setupShadowGitRepository();
            }
            verifyGitAvailability() {
              return new Promise((e) => {
                NSu.exec("git --version", (t) => {
                  e(!t);
                });
              });
            }
            async setupShadowGitRepository() {
              let e = this.getHistoryDir(),
                t = dl.join(e, ".gitconfig");
              (await Sa.mkdir(e, { recursive: !0 }),
                await Sa.writeFile(
                  t,
                  `[user]
  name = GameCowork CLI
  email = gamecowork-cli@unity.cn
[commit]
  gpgsign = false
`,
                ));
              let r = O5(e);
              (await r.checkIsRepo(kue.IS_REPO_ROOT)) ||
                (await r.init(!1, { "--initial-branch": "main" }),
                await r.commit("Initial commit", { "--allow-empty": null }));
              let n = dl.join(this.projectRoot, ".gitignore"),
                s = dl.join(e, ".gitignore"),
                o = "";
              try {
                o = await Sa.readFile(n, "utf-8");
              } catch (u) {
                if (Lu(u) && u.code !== "ENOENT") throw u;
              }
              await Sa.writeFile(s, o);
            }
            get shadowGitRepository() {
              let e = this.getHistoryDir();
              return O5(this.projectRoot).env({
                GIT_DIR: dl.join(e, ".git"),
                GIT_WORK_TREE: this.projectRoot,
                HOME: e,
                XDG_CONFIG_HOME: e,
              });
            }
            async getCurrentCommitHash() {
              return (await this.shadowGitRepository.raw("rev-parse", "HEAD")).trim();
            }
            async getCurrentGitCommitHash() {
              try {
                return (await O5(this.projectRoot).raw("rev-parse", "HEAD")).trim();
              } catch (e) {
                return (console.warn(`Failed to get current Git commit hash: ${e}`), "");
              }
            }
            async createFileSnapshot(e) {
              let t = new Date().toISOString().replace(/[:.]/g, "-"),
                r = `${t}-${Math.random().toString(36).substr(2, 9)}`,
                n = await this.getCurrentGitCommitHash(),
                s = await this.getChangedFiles();
              if (s.length === 0) return r;
              let o = dl.join(this.getHistoryDir(), "snapshots", r);
              await Sa.mkdir(o, { recursive: !0 });
              let u = { timestamp: t, commitHash: r, baseCommitHash: n, message: e, files: [] };
              for (let l of s)
                try {
                  if (l.status === "deleted")
                    u.files.push({ relativePath: l.relativePath, backupPath: "", status: "deleted" });
                  else {
                    let c = dl.join(this.projectRoot, l.relativePath);
                    if (await this.fileExists(c)) {
                      let f = l.relativePath.replace(/[/\\]/g, "_"),
                        A = dl.join(o, f);
                      (await Sa.mkdir(dl.dirname(A), { recursive: !0 }),
                        await Sa.copyFile(c, A),
                        u.files.push({
                          relativePath: l.relativePath,
                          backupPath: A,
                          status: l.status,
                          originalPath: l.originalPath,
                        }));
                    } else console.warn(`Source file does not exist, skipping backup: ${l.relativePath}`);
                  }
                } catch (c) {
                  console.warn(`Failed to backup file ${l.relativePath}: ${c}`);
                }
              let a = dl.join(o, "manifest.json");
              return (await Sa.writeFile(a, JSON.stringify(u, null, 2)), r);
            }
            async restoreProjectFromSnapshot(e) {
              let t = dl.join(this.getHistoryDir(), "snapshots", e),
                r = dl.join(t, "manifest.json");
              try {
                let n = await Sa.readFile(r, "utf-8"),
                  s = JSON.parse(n),
                  o = O5(this.projectRoot),
                  u = (await o.status()).files.length > 0,
                  a = null;
                if (u)
                  try {
                    (await o.stash(["push", "-m", `Auto-stash before checkpoint restore ${e}`])).includes(
                      "No local changes to save",
                    ) || (a = "stash@{0}");
                  } catch (l) {
                    console.warn(`Failed to stash changes before restore: ${l}`);
                  }
                if (s.baseCommitHash)
                  try {
                    (await o.reset(["--hard", s.baseCommitHash]),
                      console.log(`Reset to base commit: ${s.baseCommitHash}`),
                      await o.clean("f", ["-d"]),
                      console.log("Cleaned untracked files created after snapshot"));
                  } catch (l) {
                    console.warn(`Failed to reset to base commit ${s.baseCommitHash}: ${l}`);
                  }
                for (let l of s.files)
                  try {
                    let c = dl.join(this.projectRoot, l.relativePath);
                    if (l.status === "deleted")
                      try {
                        await Sa.unlink(c);
                      } catch (f) {
                        Lu(f) && f.code !== "ENOENT" && console.warn(`Failed to delete file ${l.relativePath}: ${f}`);
                      }
                    else if (l.status === "untracked") {
                      if (l.backupPath && (await this.fileExists(l.backupPath))) {
                        let f = dl.dirname(c);
                        (await Sa.mkdir(f, { recursive: !0 }), await Sa.copyFile(l.backupPath, c));
                      }
                    } else if (l.backupPath && (await this.fileExists(l.backupPath))) {
                      let f = dl.dirname(c);
                      (await Sa.mkdir(f, { recursive: !0 }), await Sa.copyFile(l.backupPath, c));
                    } else console.warn(`Backup file not found, cannot restore: ${l.relativePath}`);
                  } catch (c) {
                    console.warn(`Failed to restore file ${l.relativePath}: ${c}`);
                  }
                a &&
                  (console.log(`Previous changes were stashed as: ${a}`),
                  console.log('Use "git stash pop" to restore your previous changes if needed.'));
              } catch (n) {
                throw Error(`Failed to restore from snapshot ${e}: ${n}`);
              }
            }
            async getChangedFiles() {
              try {
                let e = await O5(this.projectRoot).status(),
                  t = [],
                  r = [];
                for (let u of e.files) {
                  let { path: a, index: l, working_dir: c } = u,
                    f;
                  if (l === "A") ((f = "added"), r.push(a));
                  else if (l === "M" || c === "M") ((f = "modified"), r.push(a));
                  else if (l === "D" || c === "D") f = "deleted";
                  else if (l === "R") ((f = "renamed"), r.push(a));
                  else if (l === "?" && c === "?") ((f = "untracked"), r.push(a));
                  else continue;
                  t.push({ relativePath: a, status: f });
                }
                for (let u of e.renamed)
                  t.find((a) => a.relativePath === u.to) ||
                    (r.push(u.to),
                    u.from && r.push(u.from),
                    t.push({ relativePath: u.to, status: "renamed", originalPath: u.from }));
                let n = r.map((u) => dl.join(this.projectRoot, u)),
                  s = this.fileDiscoveryService.filterFiles(n, { respectGitIgnore: !0, respectGeminiIgnore: !1 }),
                  o = new Set(s.map((u) => dl.relative(this.projectRoot, u)));
                return t.filter((u) => (u.status === "deleted" ? !0 : o.has(u.relativePath)));
              } catch (e) {
                return (console.warn(`Failed to get changed files: ${e}`), []);
              }
            }
            async fileExists(e) {
              try {
                return (await Sa.access(e), !0);
              } catch {
                return !1;
              }
            }
            async cleanupOldSnapshots(e = 50) {
              try {
                let t = dl.join(this.getHistoryDir(), "snapshots");
                try {
                  let r = await Sa.readdir(t);
                  if (r.length <= e) return;
                  let n = await Promise.all(
                    r.map(async (o) => {
                      let u = dl.join(t, o),
                        a = await Sa.stat(u);
                      return { name: o, path: u, mtime: a.mtime };
                    }),
                  );
                  n.sort((o, u) => u.mtime.getTime() - o.mtime.getTime());
                  let s = n.slice(e);
                  for (let o of s)
                    try {
                      await Sa.rm(o.path, { recursive: !0, force: !0 });
                    } catch (u) {
                      console.warn(`Failed to delete old snapshot ${o.name}: ${u}`);
                    }
                } catch (r) {
                  Lu(r) && r.code !== "ENOENT" && console.warn(`Failed to clean up snapshots: ${r}`);
                }
              } catch (t) {
                console.warn(`Failed to clean up old snapshots: ${t}`);
              }
            }
          }
```