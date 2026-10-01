// Explicit restored entry. Avoid relying on main-module path heuristics when a
// scoped preload or a packaged runtime launches the recovered module.
import {runCli} from './unity-insight-cli.js';
const code=await runCli(process.argv.slice(2));
process.exitCode=code;
