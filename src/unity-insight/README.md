# Local Unity Insight worker

The Rust host starts `bundle/gamecowork-worker-entry.mjs` with its own Node runtime and supplies one authorized project root and an owned cache directory. This entry invokes the recovered worker's real NDJSON RPC implementation. It indexes C# syntax, ShaderLab text, Unity YAML assets, GUID references and C# call relationships into SQLite. It does not use a model or remote embedding service.

The read-only reference is `original/Tuanjie Cowork/cli/bin/win32-x64/lib/bundle`, worker version `0.0.1`, protocol `4`, reported source commit `6e92ad2ce0a2918d63e1faeb5e76d6660fdf8143`. `resources/restore-manifest.json` records original worker SHA-256 values and parser asset versions, hashes, licenses and paths. Public parser assets are restored by `tools/restore-insight-resources.mjs`; that script never overwrites the maintained worker bundles. The maintained bundles resolve parser assets through relative package paths instead of an absent `node_modules` tree.

`UNITY_INSIGHT_HOME` and `GAMECOWORK_INSIGHT_INDEX_DIR` place both metrics state and each project's SQLite index below the host's owned `data/insight` directory. Project identity uses the canonical root. `GAMECOWORK_UNITY_METRICS_NO_EMIT=1` disables metrics. The worker preload restricts file reads to its package, cache and authorized project, restricts writes to the cache, and rejects child commands and external network requests. This path does not change system profile environment variables. The host shortens watch debounce to 500 ms, invalidates workers when a workspace closes, and owns the worker process lifetime.

Verification uses newly created projects below `F:/AI/AgentMake/temp/GameCowork`:

```powershell
node tests/contracts/insight-resource-contract.test.mjs
node tests/integration/insight-worker-smoke.mjs
cargo test --manifest-path src/shell/Cargo.toml --offline --locked insight::tests
node tests/e2e/insight-e2e.mjs --binary src/shell/target/release/GameCowork.exe
```

The worker smoke verifies actual file content, method extraction, GUID/call references, native watch updates, rename handling, rebuild and reopening a published SQLite index in a new process. The Rust tests additionally verify close-during-initialize, independent project startup, and disabled-worker cleanup. The browser test uses the actual maintained GUI and host routes; parser or build success alone is not UI acceptance.
