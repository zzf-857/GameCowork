//! Local Git operations scoped to the selected open workspace. No fetch, commit,
//! push, forced checkout, hooks, or user-wide Git configuration is used.
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    collections::BTreeSet,
    path::{Component, Path, PathBuf},
    process::Stdio,
    time::Duration,
};
use tokio::{
    io::{AsyncRead, AsyncReadExt},
    process::Command,
};

const LIMIT: usize = 4 * 1024 * 1024;
const TEXT_LIMIT: usize = 2 * 1024 * 1024;

pub struct Repository {
    workspace: PathBuf,
    root: PathBuf,
}
struct Output {
    ok: bool,
    stdout: Vec<u8>,
    stderr: Vec<u8>,
}

fn normalized(path: &Path) -> String {
    path.to_string_lossy()
        .replace('\\', "/")
        .trim_end_matches('/')
        .to_string()
}
fn within(path: &Path, root: &Path) -> bool {
    #[cfg(windows)]
    {
        let path = normalized(path).to_lowercase();
        let root = normalized(root).to_lowercase();
        path == root || path.starts_with(&(root + "/"))
    }
    #[cfg(not(windows))]
    {
        path.starts_with(root)
    }
}
fn text(bytes: Vec<u8>) -> Result<String, String> {
    if bytes.len() > TEXT_LIMIT || bytes.contains(&0) {
        return Err(
            "Git diff supports UTF-8 text files up to 2 MiB; this file is binary or too large"
                .into(),
        );
    }
    String::from_utf8(bytes)
        .map_err(|_| "Git diff cannot display this file's non-UTF-8 content".into())
}
async fn bounded(mut reader: impl AsyncRead + Unpin, limit: usize) -> Result<Vec<u8>, String> {
    let mut bytes = vec![];
    let mut buffer = [0; 8192];
    loop {
        let count = reader.read(&mut buffer).await.map_err(|e| e.to_string())?;
        if count == 0 {
            return Ok(bytes);
        }
        if bytes.len() + count > limit {
            return Err("Git operation exceeded its output limit".into());
        }
        bytes.extend_from_slice(&buffer[..count]);
    }
}
impl Repository {
    pub async fn open(workspace: PathBuf, directory: &str) -> Result<Self, String> {
        let workspace = workspace
            .canonicalize()
            .map_err(|e| format!("Workspace is unavailable: {e}"))?;
        let requested = PathBuf::from(directory);
        if directory.contains('\0')
            || requested
                .components()
                .any(|c| matches!(c, Component::ParentDir))
        {
            return Err("Invalid Git repository path".into());
        }
        let candidate = if requested.is_absolute() {
            requested
        } else {
            workspace.join(requested)
        };
        let root = candidate
            .canonicalize()
            .map_err(|e| format!("Git repository is unavailable: {e}"))?;
        if !root.is_dir() || !within(&root, &workspace) || !root.join(".git").exists() {
            return Err("Git repository must be inside the selected open workspace".into());
        }
        let repo = Self { workspace, root };
        let actual = repo.run(&["rev-parse", "--show-toplevel"]).await?;
        let actual = PathBuf::from(String::from_utf8_lossy(&actual).trim())
            .canonicalize()
            .map_err(|e| e.to_string())?;
        if actual != repo.root {
            return Err("The requested directory is not a Git working tree root".into());
        }
        // A forged .git file must not grant index/ref access to another project.
        for option in ["--absolute-git-dir", "--git-common-dir"] {
            let value = repo.run(&["rev-parse", option]).await?;
            let path = PathBuf::from(String::from_utf8_lossy(&value).trim());
            let path = if path.is_absolute() {
                path
            } else {
                repo.root.join(path)
            }
            .canonicalize()
            .map_err(|e| e.to_string())?;
            if !within(&path, &repo.workspace) {
                return Err("Git metadata is outside the selected workspace; open the containing workspace to use this repository".into());
            }
        }
        Ok(repo)
    }
    async fn output(&self, args: &[&str]) -> Result<Output, String> {
        let mut command = Command::new("git");
        // Do not inherit another worktree, injected config, prompts or credentials.
        for (name, _) in std::env::vars_os() {
            if name.to_string_lossy().to_uppercase().starts_with("GIT_") {
                command.env_remove(name);
            }
        }
        command
            .current_dir(&self.root)
            .env("GIT_CONFIG_NOSYSTEM", "1")
            .env(
                "GIT_CONFIG_GLOBAL",
                if cfg!(windows) { "NUL" } else { "/dev/null" },
            )
            .env("GIT_TERMINAL_PROMPT", "0")
            .env("GIT_OPTIONAL_LOCKS", "0")
            .env("GIT_NO_LAZY_FETCH", "1")
            .args([
                "--no-pager",
                "--literal-pathspecs",
                "-c",
                "core.fsmonitor=false",
                "-c",
                "core.hooksPath=/dev/null",
                "-c",
                "protocol.allow=never",
                "-c",
                "credential.helper=",
                "-c",
                "diff.external=",
                "-c",
                "core.quotePath=false",
            ])
            .args(args)
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .kill_on_drop(true);
        #[cfg(windows)]
        command.creation_flags(0x08000000);
        let mut child = command
            .spawn()
            .map_err(|e| format!("Cannot run Git: {e}"))?;
        let stdout = child.stdout.take().unwrap();
        let stderr = child.stderr.take().unwrap();
        let result = tokio::time::timeout(Duration::from_secs(15), async {
            tokio::try_join!(bounded(stdout, LIMIT), bounded(stderr, 64 * 1024), async {
                child.wait().await.map_err(|e| e.to_string())
            })
        })
        .await;
        match result {
            Ok(Ok((stdout, stderr, status))) => Ok(Output {
                ok: status.success(),
                stdout,
                stderr,
            }),
            Ok(Err(error)) => Err(error),
            Err(_) => Err("Git operation timed out; no forced retry was performed".into()),
        }
    }
    async fn run(&self, args: &[&str]) -> Result<Vec<u8>, String> {
        let output = self.output(args).await?;
        if output.ok {
            Ok(output.stdout)
        } else {
            Err(format!(
                "Git operation failed: {}",
                String::from_utf8_lossy(&output.stderr).trim()
            ))
        }
    }
    async fn has_head(&self) -> Result<bool, String> {
        Ok(self.output(&["rev-parse", "--verify", "HEAD"]).await?.ok)
    }
    fn relative(&self, input: &str) -> Result<String, String> {
        if input.is_empty() || input.contains('\0') {
            return Err("A Git file path is required".into());
        }
        let path = PathBuf::from(input);
        if path.is_absolute()
            || path
                .components()
                .any(|c| !matches!(c, Component::Normal(_)))
        {
            return Err(
                "Git file actions require literal repository-relative paths without traversal"
                    .into(),
            );
        }
        if path
            .components()
            .any(|c| c.as_os_str().to_string_lossy().eq_ignore_ascii_case(".git"))
        {
            return Err("Git metadata cannot be read or modified as a project file".into());
        }
        // Resolve the nearest existing ancestor, including symlinks/junctions.
        let mut candidate = self.root.join(&path);
        while !candidate.exists() {
            candidate = candidate
                .parent()
                .ok_or("Invalid Git file path")?
                .to_path_buf();
        }
        let resolved = candidate.canonicalize().map_err(|e| e.to_string())?;
        if !within(&resolved, &self.root) {
            return Err("Git file path escapes the repository".into());
        }
        Ok(normalized(&path))
    }
    pub async fn branch(&self) -> Result<Value, String> {
        let result = self
            .output(&["symbolic-ref", "--quiet", "--short", "HEAD"])
            .await?;
        if result.ok {
            return Ok(json!(String::from_utf8_lossy(&result.stdout).trim()));
        }
        let commit = self.run(&["rev-parse", "--short", "HEAD"]).await?;
        Ok(json!(format!(
            "HEAD detached at {}",
            String::from_utf8_lossy(&commit).trim()
        )))
    }
    pub async fn branches(&self) -> Result<Value, String> {
        let output = self
            .run(&["for-each-ref", "--format=%(refname:short)", "refs/heads/"])
            .await?;
        Ok(json!(String::from_utf8_lossy(&output)
            .lines()
            .filter(|s| !s.is_empty())
            .collect::<Vec<_>>()))
    }
    pub async fn changed(&self) -> Result<Value, String> {
        let output = self
            .run(&[
                "status",
                "--porcelain=v1",
                "-z",
                "--untracked-files=all",
                "--ignore-submodules=none",
            ])
            .await?;
        let mut fields = output.split(|b| *b == 0).filter(|row| !row.is_empty());
        let mut rows = vec![];
        while let Some(row) = fields.next() {
            if row.len() < 4 || row[2] != b' ' {
                return Err("Git returned an invalid status record".into());
            }
            let x = row[0];
            let y = row[1];
            let path = String::from_utf8(row[3..].to_vec())
                .map_err(|_| "Git path cannot be represented as UTF-8")?;
            let renamed = [x, y].iter().any(|c| matches!(c, b'R' | b'C'));
            let old = if renamed {
                Some(
                    String::from_utf8(fields.next().ok_or("Missing Git rename source")?.to_vec())
                        .map_err(|_| "Git path cannot be represented as UTF-8")?,
                )
            } else {
                None
            };
            let conflicted =
                x == b'U' || y == b'U' || matches!((x, y), (b'A', b'A') | (b'D', b'D'));
            rows.push(json!({"path":path,"oldPath":old,"staged":x!=b' ' && x!=b'?',"unstaged":y!=b' ' && y!=b'?',"untracked":x==b'?' && y==b'?',"status":format!("{}{}",x as char,y as char),"conflicted":conflicted}));
        }
        Ok(json!(rows))
    }
    pub async fn file(&self, input: &str, index: bool) -> Result<Value, String> {
        Ok(json!(match self.file_bytes(input, index).await? {
            Some(bytes) => text(bytes)?,
            None => String::new(),
        }))
    }
    async fn file_bytes(&self, input: &str, index: bool) -> Result<Option<Vec<u8>>, String> {
        let path = self.relative(input)?;
        let output = if index {
            self.run(&["ls-files", "--stage", "-z", "--", &path])
                .await?
        } else {
            if !self.has_head().await? {
                return Ok(None);
            }
            self.run(&["ls-tree", "-z", "HEAD", "--", &path]).await?
        };
        if output.is_empty() {
            return Ok(None);
        }
        let rows: Vec<_> = output
            .split(|b| *b == 0)
            .filter(|row| !row.is_empty())
            .collect();
        if rows.len() != 1 {
            return Err("This file has unresolved Git conflicts; resolve them before opening its index diff".into());
        }
        let row = String::from_utf8(rows[0].to_vec()).map_err(|_| "Invalid Git entry")?;
        let (header, returned_path) = row.split_once('\t').ok_or("Invalid Git entry")?;
        let parts: Vec<_> = header.split_whitespace().collect();
        if returned_path != path
            || parts.len() != 3
            || !matches!(parts[0], "100644" | "100755")
            || (index && parts[2] != "0")
        {
            return Err(
                "Git diff cannot display a conflict, directory, symlink or submodule as text"
                    .into(),
            );
        }
        let oid = if index { parts[1] } else { parts[2] };
        Ok(Some(self.run(&["cat-file", "blob", oid]).await?))
    }
    async fn mutation_ready(&self) -> Result<(), String> {
        let filters = self
            .output(&[
                "config",
                "--local",
                "--name-only",
                "--get-regexp",
                "^filter\\..*\\.(clean|smudge|process)$",
            ])
            .await?;
        if filters.ok && !filters.stdout.is_empty() {
            return Err("This repository uses custom Git filters; use its configured Git client for file actions".into());
        }
        if self.root.join(".git/index.lock").exists() {
            return Err("Another Git operation is holding the repository index lock".into());
        }
        Ok(())
    }
    pub async fn switch(&self, branch: &str) -> Result<Value, String> {
        if branch.is_empty() || branch.starts_with('-') || branch.contains('\0') {
            return Err("Invalid Git branch name".into());
        }
        self.run(&["check-ref-format", "--branch", branch]).await?;
        let branches = self.branches().await?;
        if !branches
            .as_array()
            .unwrap()
            .iter()
            .any(|v| v.as_str() == Some(branch))
        {
            return Err("Choose an existing local Git branch".into());
        }
        if self.branch().await?.as_str() == Some(branch) {
            return Ok(json!({"ok":true,"branch":branch,"changed":false}));
        }
        self.mutation_ready().await?;
        if !self.changed().await?.as_array().unwrap().is_empty() {
            return Err("The repository has uncommitted or untracked changes. Save or discard them before switching branches".into());
        }
        self.run(&["switch", "--no-guess", branch]).await?;
        if self.branch().await?.as_str() != Some(branch) {
            return Err("Git did not switch to the requested branch".into());
        }
        Ok(json!({"ok":true,"branch":branch,"changed":true}))
    }
    pub async fn action(
        &self,
        action: &str,
        paths: &[String],
        backup_root: &Path,
    ) -> Result<Value, String> {
        if !matches!(action, "stage" | "unstage" | "discard") {
            return Err("Unsupported Git file action".into());
        }
        if paths.is_empty() || paths.len() > 200 {
            return Err("Select between 1 and 200 Git files".into());
        }
        let paths: Vec<_> = paths
            .iter()
            .map(|p| self.relative(p))
            .collect::<Result<BTreeSet<_>, _>>()?
            .into_iter()
            .collect();
        self.mutation_ready().await?;
        let changed = self.changed().await?;
        let rows = changed.as_array().unwrap();
        for path in &paths {
            let matches: Vec<_> = rows
                .iter()
                .filter(|r| r["path"] == *path || r["oldPath"] == *path)
                .collect();
            if matches.is_empty() {
                return Err(format!("Git file is no longer changed: {path}"));
            }
            if matches.iter().any(|r| r["conflicted"] == true) {
                return Err("This file has unresolved Git conflicts; automatic file actions were not applied".into());
            }
            if self.root.join(path).is_dir()
                || std::fs::symlink_metadata(self.root.join(path))
                    .map(|m| m.file_type().is_symlink())
                    .unwrap_or(false)
            {
                return Err("Git file actions cannot replace directories or submodules".into());
            }
        }
        let borrowed: Vec<_> = paths.iter().map(String::as_str).collect();
        let mut attributes = vec!["check-attr", "-z", "filter", "--"];
        attributes.extend_from_slice(&borrowed);
        let attrs = self.run(&attributes).await?;
        let fields: Vec<_> = attrs.split(|b| *b == 0).filter(|s| !s.is_empty()).collect();
        if fields
            .chunks(3)
            .any(|row| row.len() != 3 || !matches!(row[2], b"unspecified" | b"unset"))
        {
            return Err(
                "This file uses a custom Git filter; use its configured Git client for this action"
                    .into(),
            );
        }
        let mut command = match action {
            "stage" => vec!["add", "-A", "--"],
            "unstage" if self.has_head().await? => {
                vec!["restore", "--staged", "--source=HEAD", "--"]
            }
            "unstage" => vec!["rm", "--cached", "-f", "--ignore-unmatch", "--"],
            _ => vec![],
        };
        if action != "discard" {
            command.extend_from_slice(&borrowed);
            self.run(&command).await?;
            return Ok(json!({"ok":true,"action":action,"paths":paths}));
        }
        // Snapshot all paths and converted index bytes before changing any file.
        // Atomic mutation primitives preserve the exact displaced version when
        // an external save races the advisory SHA recheck.
        let backup = backup_root.join(uuid::Uuid::new_v4().to_string());
        std::fs::create_dir_all(&backup).map_err(|e| e.to_string())?;
        let files = crate::files::Files::new(&self.root, std::slice::from_ref(&self.root))
            .map_err(|e| e.to_string())?;
        let mut plans = vec![];
        for path in &paths {
            let source = self.root.join(path);
            let original = if source.is_file() {
                let bytes = files
                    .media(source.to_string_lossy().as_ref())
                    .map_err(|e| e.to_string())?
                    .0;
                let dest = backup.join("files").join(path);
                std::fs::create_dir_all(dest.parent().unwrap()).map_err(|e| e.to_string())?;
                std::fs::write(&dest, &bytes)
                    .map_err(|e| format!("Cannot preserve file before discard: {e}"))?;
                Some(bytes)
            } else {
                None
            };
            let expected = original
                .as_ref()
                .map(|bytes| format!("{:x}", Sha256::digest(bytes)));
            let untracked = rows
                .iter()
                .any(|row| row["path"] == *path && row["untracked"] == true);
            let replacement = if untracked {
                None
            } else if self.file_bytes(path, true).await?.is_some() {
                Some(
                    self.run(&[
                        "cat-file",
                        "--filters",
                        &format!("--path={path}"),
                        &format!(":{path}"),
                    ])
                    .await?,
                )
            } else {
                None
            };
            if untracked || replacement.is_some() {
                plans.push((path.clone(), expected, untracked, replacement));
            }
        }
        let target_root = self.root.clone();
        let backup_path = backup.clone();
        let result=tokio::task::spawn_blocking(move||{
            let mutations=crate::mutations::Mutations::new(&target_root,&backup_path.join("changes")).map_err(|e|e.to_string())?;
            let mut changes=vec![];
            for (path,expected,untracked,replacement) in plans {
                let outcome=if untracked { mutations.recycle_file(&path,crate::mutations::DeleteOptions{expected_sha256:expected,allow_sensitive:false}) }
                    else { mutations.restore_git_bytes(&path,replacement.as_ref().unwrap(),expected.as_deref()) };
                match outcome {Ok(receipt)=>changes.push(receipt),Err(error)=>{
                    let applied=error.json()["applied"]==true || !changes.is_empty();
                    let failure=json!({"ok":false,"action":"discard","applied":applied,"recoveryNeeded":applied,"error":format!("Git discard stopped: {error}. Preserved versions are available in {}",normalized(&backup_path)),"failure":error.json(),"changes":changes,"backupPath":normalized(&backup_path)});
                    std::fs::write(backup_path.join("manifest.json"),serde_json::to_vec_pretty(&failure).unwrap()).map_err(|e|e.to_string())?;
                    return Ok::<Value,String>(failure);
                }}
            }
            Ok(json!({"ok":true,"action":"discard","applied":true,"recoveryNeeded":false,"changes":changes,"backupPath":normalized(&backup_path)}))
        }).await.map_err(|e|e.to_string())??;
        let manifest = json!({"repository":normalized(&self.root),"paths":paths,"result":result});
        std::fs::write(
            backup.join("manifest.json"),
            serde_json::to_vec_pretty(&manifest).unwrap(),
        )
        .map_err(|e| e.to_string())?;
        Ok(result)
    }
    pub async fn diff(&self, include_unstaged: bool) -> Result<Value, String> {
        let staged = self
            .run(&[
                "diff",
                "--cached",
                "--no-ext-diff",
                "--no-textconv",
                "--no-color",
            ])
            .await?;
        let mut diffs = vec![];
        if !staged.is_empty() {
            diffs.push(text(staged)?);
        }
        if include_unstaged {
            let working = self
                .run(&["diff", "--no-ext-diff", "--no-textconv", "--no-color"])
                .await?;
            if !working.is_empty() {
                diffs.push(text(working)?);
            }
        }
        Ok(json!(diffs))
    }
}

pub async fn request(
    workspace: PathBuf,
    backups: PathBuf,
    kind: &str,
    data: &Value,
) -> Result<Value, String> {
    if kind == "getDiff" && data.get("dir").is_none() {
        let primary = workspace.clone();
        let repositories = tokio::task::spawn_blocking(move || {
            crate::files::Files::new(&primary, std::slice::from_ref(&primary))
                .and_then(|files| files.git_repositories("."))
        })
        .await
        .map_err(|e| e.to_string())?
        .map_err(|e| e.to_string())?;
        let mut result = vec![];
        for row in repositories.as_array().unwrap() {
            let repo =
                Repository::open(workspace.clone(), row["repoDir"].as_str().unwrap()).await?;
            result.extend(
                repo.diff(data["includeUnstaged"].as_bool().unwrap_or(false))
                    .await?
                    .as_array()
                    .unwrap()
                    .iter()
                    .cloned(),
            );
        }
        return Ok(json!(result));
    }
    let repo = Repository::open(workspace, data["dir"].as_str().unwrap_or(".")).await?;
    match kind {
        "getBranch" => repo.branch().await,
        "getGitBranches" => repo.branches().await,
        "getChangedFiles" => repo.changed().await,
        "switchGitBranch" => repo.switch(data["branch"].as_str().unwrap_or("")).await,
        "getFileAtHead" | "getFileAtIndex" => {
            repo.file(
                data["filePath"].as_str().unwrap_or(""),
                kind == "getFileAtIndex",
            )
            .await
        }
        "getDiff" => {
            repo.diff(data["includeUnstaged"].as_bool().unwrap_or(false))
                .await
        }
        "applyGitFileAction" => {
            let paths = data["paths"]
                .as_array()
                .ok_or("Git paths must be an array")?
                .iter()
                .map(|p| {
                    p.as_str()
                        .map(str::to_owned)
                        .ok_or("Git paths must be strings")
                })
                .collect::<Result<Vec<_>, _>>()?;
            repo.action(data["action"].as_str().unwrap_or(""), &paths, &backups)
                .await
        }
        _ => Err("Unsupported Git operation".into()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    struct Fixture(PathBuf);
    impl Fixture {
        fn new() -> Self {
            let root = PathBuf::from("F:/AI/AgentMake/temp/GameCowork/tests")
                .join(format!("git-unit-{}", uuid::Uuid::new_v4()));
            std::fs::create_dir_all(&root).unwrap();
            Self(root)
        }
        fn git(&self, args: &[&str]) {
            let output = std::process::Command::new("git")
                .current_dir(&self.0)
                .args(args)
                .output()
                .unwrap();
            assert!(
                output.status.success(),
                "{}",
                String::from_utf8_lossy(&output.stderr)
            );
        }
    }
    #[tokio::test]
    async fn real_repository_index_diff_discard_unborn_and_literal_paths() {
        let f = Fixture::new();
        let backups =
            f.0.parent()
                .unwrap()
                .join(format!("git-unit-backups-{}", uuid::Uuid::new_v4()));
        f.git(&["init", "--initial-branch=main"]);
        f.git(&["config", "user.name", "GameCowork Fixture"]);
        f.git(&["config", "user.email", "fixture@invalid"]);
        f.git(&["config", "core.autocrlf", "false"]);
        std::fs::write(f.0.join("empty.txt"), "").unwrap();
        std::fs::write(f.0.join("中文 [literal].txt"), "first\n").unwrap();
        let r = Repository::open(f.0.clone(), ".").await.unwrap();
        assert_eq!(r.branch().await.unwrap(), "main");
        assert_eq!(r.file("中文 [literal].txt", false).await.unwrap(), "");
        r.action("stage", &["中文 [literal].txt".into()], &backups)
            .await
            .unwrap();
        std::fs::write(f.0.join("中文 [literal].txt"), "second\n").unwrap();
        assert_eq!(r.file("中文 [literal].txt", true).await.unwrap(), "first\n");
        r.action("unstage", &["中文 [literal].txt".into()], &backups)
            .await
            .unwrap();
        assert_eq!(
            std::fs::read_to_string(f.0.join("中文 [literal].txt")).unwrap(),
            "second\n"
        );
        f.git(&["add", "-A"]);
        f.git(&["commit", "-m", "owned fixture baseline"]);
        std::fs::write(f.0.join("中文 [literal].txt"), "third\n").unwrap();
        let receipt = r
            .action("discard", &["中文 [literal].txt".into()], &backups)
            .await
            .unwrap();
        assert_eq!(
            std::fs::read_to_string(f.0.join("中文 [literal].txt")).unwrap(),
            "second\n"
        );
        assert_eq!(
            std::fs::read_to_string(
                PathBuf::from(receipt["backupPath"].as_str().unwrap())
                    .join("files/中文 [literal].txt")
            )
            .unwrap(),
            "third\n"
        );
        for input in [
            "../escape",
            ".git/config",
            "dir/../../escape",
            ":(glob)*",
            "F:/private.txt",
        ] {
            assert!(r.file(input, false).await.is_err() || input == ":(glob)*");
        }
        assert_eq!(r.file("empty.txt", false).await.unwrap(), "");
        std::fs::write(f.0.join("blob.bin"), [0, 1, 255]).unwrap();
        f.git(&["add", "blob.bin"]);
        assert!(r
            .file("blob.bin", true)
            .await
            .unwrap_err()
            .contains("binary"));
    }
}
