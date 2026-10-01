import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";
const harness=fileURLToPath(new URL("./editor-preview-e2e.mjs",import.meta.url));
const child=spawn(process.execPath,[harness,"--domain-reload","--reload-close",...process.argv.slice(2)],{windowsHide:true,stdio:"inherit"});
child.on("error",error=>{throw error;});
child.on("exit",code=>{process.exitCode=code??1;});
