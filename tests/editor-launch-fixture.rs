// An inert editor executable for the isolated host/lifetime test only.
#![cfg_attr(target_os = "windows", windows_subsystem = "windows")]
use std::{fs, path::PathBuf, time::Duration};
fn main() {
    let args: Vec<String> = std::env::args().collect();
    let Some(index) = args.iter().position(|arg| arg == "-projectPath") else { std::process::exit(2); };
    let Some(project) = args.get(index + 1) else { std::process::exit(2); };
    let root = fs::canonicalize(project).expect("fixture project exists");
    let base = fs::canonicalize(PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests")).expect("fixture base exists");
    assert!(root.starts_with(base), "fake editor only accepts isolated fixture projects");
    fs::write(root.join("fixture-editor-ready.pid"), std::process::id().to_string()).unwrap();
    loop { std::thread::sleep(Duration::from_secs(1)); }
}
