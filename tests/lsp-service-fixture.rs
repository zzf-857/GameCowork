// Compiled only by the isolated Cargo harness in lsp-service-smoke.mjs.
use lsp::{Config, LspService, Position};
use serde::Deserialize;
use serde_json::{json, Value};
use std::{fs, path::PathBuf, time::Duration};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct FixtureConfig {
    runtime: PathBuf,
    tampered_runtime: PathBuf,
    ledger: PathBuf,
    ledger_sha256: String,
    data: PathBuf,
    projects: Vec<PathBuf>,
    report: PathBuf,
    hold: bool,
    escaped_data: PathBuf,
    escaped_target: PathBuf,
}
fn position(text: &str, needle: &str, occurrence: usize) -> Position {
    let mut offset = 0;
    for _ in 0..=occurrence {
        offset += text[offset..]
            .find(needle)
            .expect("fixture source contains symbol");
        offset += needle.len();
    }
    offset -= needle.len();
    let before = &text[..offset];
    Position {
        line: before.bytes().filter(|b| *b == b'\n').count() as u32,
        character: before.rsplit('\n').next().unwrap().encode_utf16().count() as u32,
    }
}
fn hover_text(result: &Value) -> String {
    let contents = &result["hover"]["contents"];
    if let Some(text) = contents.as_str() {
        return text.to_owned();
    }
    if let Some(text) = contents["value"].as_str() {
        return text.to_owned();
    }
    contents
        .as_array()
        .map(|array| {
            array
                .iter()
                .map(|item| {
                    item.as_str()
                        .or_else(|| item["value"].as_str())
                        .unwrap_or("")
                })
                .collect::<Vec<_>>()
                .join("\n")
        })
        .unwrap_or_default()
}
async fn semantic(
    service: &LspService,
    handle: &lsp::WorkspaceHandle,
    text: &str,
    needle: &str,
) -> Value {
    let deadline = tokio::time::Instant::now() + Duration::from_secs(10);
    loop {
        let result = service
            .hover(handle, "Calculator.cs", position(text, needle, 1))
            .await
            .unwrap();
        if hover_text(&result).contains(needle) {
            return result;
        }
        assert!(
            tokio::time::Instant::now() < deadline,
            "semantic hover became ready"
        );
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
}
async fn verify(
    config: &FixtureConfig,
    checks: &mut Vec<String>,
) -> Result<(), Box<dyn std::error::Error>> {
    let runtime = Config {
        executable: config.runtime.clone(),
        ledger: config.ledger.clone(),
        ledger_sha256: config.ledger_sha256.clone(),
        app_data_root: config.data.clone(),
    };
    let mut invalid = runtime.clone();
    invalid.ledger_sha256 = "0".repeat(64);
    assert_eq!(
        LspService::new(invalid).err().unwrap().code,
        "lsp_runtime_integrity"
    );
    checks.push("Runtime ledger SHA tampering rejects before subprocess startup".into());
    let mut tampered = runtime.clone();
    tampered.executable = config.tampered_runtime.clone();
    assert_eq!(
        LspService::new(tampered).err().unwrap().code,
        "lsp_runtime_integrity"
    );
    checks.push("Executable byte tampering fails the frozen resource SHA before startup".into());
    let service = LspService::new(runtime)?;
    let a = service.open_workspace(&config.projects[0]).await?;
    let b = service.open_workspace(&config.projects[1]).await?;
    assert_eq!(service.status(&a).await?["pid"], Value::Null);
    assert_eq!(service.status(&a).await?["enabled"], false);
    assert_eq!(
        service
            .hover(
                &a,
                "Calculator.cs",
                Position {
                    line: 4,
                    character: 26
                }
            )
            .await
            .unwrap_err()
            .code,
        "lsp_disabled"
    );
    checks.push("Register/status/disabled query do not start a language server".into());
    let (a_status, b_status) = tokio::join!(
        service.set_enabled(&a, true, None),
        service.set_enabled(&b, true, None)
    );
    let a_status = a_status?;
    let b_status = b_status?;
    assert_eq!(a_status["ready"], true);
    assert_eq!(b_status["ready"], true);
    assert_ne!(a_status["pid"], b_status["pid"]);
    checks.push(
        "Actual independent C# servers and Jobs initialize and finish workspace loading".into(),
    );
    if config.hold {
        println!(
            "{}",
            json!({"holdReady":true,"pids":[a_status["pid"],b_status["pid"]]})
        );
        loop {
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
    }
    let escaped = LspService::new(Config {
        executable: config.runtime.clone(),
        ledger: config.ledger.clone(),
        ledger_sha256: config.ledger_sha256.clone(),
        app_data_root: config.escaped_data.clone(),
    })?;
    let escaped_workspace = escaped.open_workspace(&config.projects[0]).await?;
    assert_eq!(
        escaped
            .set_enabled(&escaped_workspace, true, None)
            .await
            .unwrap_err()
            .code,
        "lsp_cache_path"
    );
    assert_eq!(fs::read_dir(&config.escaped_target)?.count(), 0);
    escaped.close_workspace(&escaped_workspace).await?;
    checks.push(
        "AppData cache junction escape rejects before creating data outside the owned storage root"
            .into(),
    );
    let alternate = config.projects[0].join("Alternate.sln");
    fs::copy(config.projects[0].join("Fixture.sln"), &alternate)?;
    assert_eq!(service.status(&a).await?["supported"], true);
    assert_eq!(
        service
            .set_enabled(&a, true, Some(&alternate))
            .await
            .unwrap_err()
            .code,
        "lsp_project_change_required"
    );
    fs::remove_file(&alternate)?;
    checks.push("A selected running solution remains supported; changing it requires explicit disable instead of silently reusing another solution".into());
    let original_a = fs::read_to_string(config.projects[0].join("Calculator.cs"))?;
    let original_b = fs::read_to_string(config.projects[1].join("Calculator.cs"))?;
    service
        .sync_document(&a, "Calculator.cs", &original_a, 1)
        .await?;
    service
        .sync_document(&b, "Calculator.cs", &original_b, 1)
        .await?;
    let hover_a = semantic(&service, &a, &original_a, "Combine").await;
    let hover_b = semantic(&service, &b, &original_b, "Combine").await;
    assert!(hover_text(&hover_a).contains("int"));
    assert!(hover_text(&hover_b).contains("string"));
    checks.push("Rust transport returns real int A/string B semantic hover".into());
    for (handle, text) in [(&a, &original_a), (&b, &original_b)] {
        let definitions = service
            .definition(handle, "Calculator.cs", position(text, "Combine", 1))
            .await?;
        assert_eq!(definitions["locations"].as_array().unwrap().len(), 1);
        assert_eq!(definitions["locations"][0]["range"]["start"]["line"], 3);
        let refs = service
            .references(handle, "Calculator.cs", position(text, "Combine", 1), true)
            .await?;
        let mut lines = refs["locations"]
            .as_array()
            .unwrap()
            .iter()
            .map(|item| item["range"]["start"]["line"].as_u64().unwrap())
            .collect::<Vec<_>>();
        lines.sort();
        assert_eq!(lines, vec![3, 4, 5]);
    }
    checks.push("Rust definition/reference normalization returns actual declaration and both call sites in each source root".into());
    let edited = original_a.replace("Combine", "UnsavedAdd").replace(
        "public int Second() => UnsavedAdd(20, 22);",
        "public int Second() => 0;",
    );
    service
        .sync_document(&a, "Calculator.cs", &edited, 2)
        .await?;
    assert!(hover_text(&semantic(&service, &a, &edited, "UnsavedAdd").await).contains("int"));
    let refs = service
        .references(
            &a,
            "Calculator.cs",
            position(&edited, "UnsavedAdd", 1),
            true,
        )
        .await?;
    assert_eq!(refs["locations"].as_array().unwrap().len(), 2);
    assert_eq!(refs["version"], 2);
    assert_eq!(
        fs::read_to_string(config.projects[0].join("Calculator.cs"))?,
        original_a
    );
    assert!(hover_text(&semantic(&service, &b, &original_b, "Combine").await).contains("string"));
    checks.push("Unsaved full-text version 2 changes A semantic results without disk writes or B contamination".into());
    assert_eq!(
        service
            .sync_document(&a, "Calculator.cs", &original_a, 1)
            .await
            .unwrap_err()
            .code,
        "lsp_document_version"
    );
    assert_eq!(
        service
            .sync_document(&a, "Calculator.cs", &original_a, 2)
            .await
            .unwrap_err()
            .code,
        "lsp_document_version"
    );
    assert_eq!(
        service
            .sync_document(&a, "Calculator.cs", &edited, 2)
            .await?["changed"],
        false
    );
    checks.push(
        "Older versions and equal-version different bytes reject; identical replay is idempotent"
            .into(),
    );
    let unicode = edited.replace(
        "    public int First() => UnsavedAdd(20, 22);",
        "    public int First() => /* 😀 中文 */ UnsavedAdd(20, 22);",
    );
    service
        .sync_document(&a, "Calculator.cs", &unicode, 3)
        .await?;
    assert!(hover_text(&semantic(&service, &a, &unicode, "UnsavedAdd").await).contains("int"));
    assert_eq!(
        service
            .hover(
                &a,
                "Calculator.cs",
                Position {
                    line: 4,
                    character: position(&unicode, "😀", 0).character + 1
                }
            )
            .await
            .unwrap_err()
            .code,
        "lsp_position_invalid"
    );
    checks.push(
        "UTF-8 Content-Length and UTF-16 Unicode source positions are distinct and validated"
            .into(),
    );
    for path in [
        "../outside.cs",
        config.projects[1].join("Calculator.cs").to_str().unwrap(),
        "file://other-host/Calculator.cs",
    ] {
        assert!(service.sync_document(&a, path, &edited, 4).await.is_err());
    }
    assert_eq!(
        service
            .hover(
                &a,
                "Calculator.cs",
                Position {
                    line: 9999,
                    character: 0
                }
            )
            .await
            .unwrap_err()
            .code,
        "lsp_position_invalid"
    );
    checks.push(
        "Native paths/file URIs cannot cross workspaces or bypass document/UTF-16 bounds".into(),
    );
    service.close_document(&a, "Calculator.cs").await?;
    assert_eq!(
        service
            .sync_document(&a, "Calculator.cs", &original_a, 3)
            .await
            .unwrap_err()
            .code,
        "lsp_document_version"
    );
    assert_eq!(
        service
            .hover(
                &a,
                "Calculator.cs",
                Position {
                    line: 4,
                    character: 26
                }
            )
            .await
            .unwrap_err()
            .code,
        "lsp_document_not_open"
    );
    service
        .sync_document(&a, "Calculator.cs", &original_a, 4)
        .await?;
    assert!(hover_text(&semantic(&service, &a, &original_a, "Combine").await).contains("int"));
    checks.push(
        "Balanced close/reopen clears the unsaved document and restores original semantics".into(),
    );
    let deleted = config.projects[1].join("Disposable.cs");
    fs::write(&deleted, "public sealed class Disposable {}")?;
    service
        .sync_document(&b, "Disposable.cs", "public sealed class Disposable {}", 1)
        .await?;
    fs::remove_file(&deleted)?;
    assert_eq!(
        service.close_document(&b, "Disposable.cs").await?["changed"],
        true
    );
    checks.push(
        "Closing a document deleted on disk still balances didClose and clears its in-memory draft"
            .into(),
    );
    let disabled = service.set_enabled(&a, false, None).await?;
    assert_eq!(disabled["stopped"]["stopped"], true);
    assert_eq!(
        service.status(&a).await.unwrap_err().code,
        "lsp_workspace_closed"
    );
    let a_new = service.workspace(&config.projects[0]).await?;
    assert_ne!(a.generation(), a_new.generation());
    assert_eq!(service.status(&a_new).await?["enabled"], false);
    assert!(hover_text(&semantic(&service, &b, &original_b, "Combine").await).contains("string"));
    checks
        .push("Disable invalidates captured handles and reclaims A without interrupting B".into());
    service.close_workspace(&a_new).await?;
    assert!(service.workspace(&config.projects[0]).await.is_err());
    let reopened = service.open_workspace(&config.projects[0]).await?;
    assert_ne!(reopened.generation(), a_new.generation());
    assert_eq!(service.status(&reopened).await?["pid"], Value::Null);
    service.close_workspace(&reopened).await?;
    checks.push(
        "Closed/reopened identical paths get distinct generations and never revive old servers"
            .into(),
    );
    let missing = service.open_workspace(&config.projects[3]).await?;
    assert_eq!(
        service
            .set_enabled(&missing, true, None)
            .await
            .unwrap_err()
            .code,
        "lsp_project_missing"
    );
    assert_eq!(service.status(&missing).await?["connected"], false);
    assert_eq!(service.status(&missing).await?["supported"], false);
    service.close_workspace(&missing).await?;
    checks.push(
        "Missing C# solution/project metadata returns real unsupported status and starts no server"
            .into(),
    );
    let unrestored = service.open_workspace(&config.projects[5]).await?;
    assert_eq!(
        service
            .set_enabled(&unrestored, true, None)
            .await
            .unwrap_err()
            .code,
        "lsp_restore_required"
    );
    assert_eq!(service.status(&unrestored).await?["pid"], Value::Null);
    assert!(!config.projects[5].join("obj").exists());
    service.close_workspace(&unrestored).await?;
    checks.push("Missing SDK dependency assets reject explicitly without automatic restore or project metadata generation".into());
    let race = service.open_workspace(&config.projects[4]).await?;
    let own_service = service.clone();
    let own_handle = race.clone();
    let starting =
        tokio::spawn(async move { own_service.set_enabled(&own_handle, true, None).await });
    let deadline = tokio::time::Instant::now() + Duration::from_secs(10);
    loop {
        if !service.status(&race).await?["pid"].is_null() {
            break;
        }
        assert!(tokio::time::Instant::now() < deadline);
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    assert_eq!(service.close_workspace(&race).await?["closed"], true);
    let _ = starting.await?;
    assert!(service.workspace(&config.projects[4]).await.is_err());
    assert!(service.status(&race).await.is_err());
    checks.push("Closing while a real server initializes cancels its generation and cannot publish/revive it".into());
    let csproj = service.open_workspace(&config.projects[2]).await?;
    service.set_enabled(&csproj, true, None).await?;
    let csproj_text = fs::read_to_string(config.projects[2].join("Calculator.cs"))?;
    service
        .sync_document(&csproj, "Calculator.cs", &csproj_text, 1)
        .await?;
    assert!(
        hover_text(&semantic(&service, &csproj, &csproj_text, "Combine").await).contains("int")
    );
    service.close_workspace(&csproj).await?;
    checks.push(
        "Real csharp-ls also loads an existing SDK project without generating a solution".into(),
    );
    let closed_b = service.close_workspace(&b).await?;
    assert_eq!(closed_b["stopped"]["exitCode"], 0);
    checks
        .push("Final B shutdown/exit completes normally through the owned process manager".into());
    Ok(())
}
#[tokio::main]
async fn main() {
    let config: FixtureConfig = serde_json::from_slice(
        &fs::read(std::env::args().nth(1).expect("fixture config")).unwrap(),
    )
    .unwrap();
    let task_root = config
        .data
        .canonicalize()
        .unwrap()
        .parent()
        .unwrap()
        .to_path_buf();
    let allowed = PathBuf::from("F:/AI/AgentMake/temp/GameCowork/tests")
        .canonicalize()
        .unwrap();
    assert!(task_root.starts_with(&allowed));
    for project in &config.projects {
        assert!(project.canonicalize().unwrap().starts_with(&task_root));
    }
    assert!(config
        .report
        .parent()
        .unwrap()
        .canonicalize()
        .unwrap()
        .starts_with(&task_root));
    assert!(config
        .tampered_runtime
        .canonicalize()
        .unwrap()
        .starts_with(&task_root));
    let mut checks = vec![];
    let result = verify(&config, &mut checks).await;
    fs::write(&config.report,serde_json::to_vec_pretty(&json!({"success":result.is_ok(),"foundationOnly":true,"checks":checks,"error":result.as_ref().err().map(|e|e.to_string())})).unwrap()).unwrap();
    if let Err(error) = result {
        eprintln!("{error}");
        std::process::exit(1);
    }
}
