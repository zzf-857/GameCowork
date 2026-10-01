// Extend the existing test guard with redacted launch evidence for the exact owned Agent.
require('./real-core-guard.cjs');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const original = cp.spawn.bind(cp);
const exactAgent = path.resolve(process.env.GAMECOWORK_SMOKE_CLI_PATH).toLowerCase();
cp.spawn = (...args) => {
  if (typeof args[0] === 'string' && path.resolve(args[0]).toLowerCase() === exactAgent) {
    const env = args[2]?.env || process.env;
    let baseUrlLoopback = false;
    try { baseUrlLoopback = ['127.0.0.1', 'localhost', '::1'].includes(new URL(env.OPENAI_BASE_URL).hostname); } catch {}
    fs.appendFileSync(path.join(process.env.GAMECOWORK_SMOKE_ROOT, 'agent-launch-shape.jsonl'), JSON.stringify({
      cwd: args[2]?.cwd, flags: (args[1] || []).filter(value => typeof value === 'string' && value.startsWith('--')),
      keyPresent: Boolean(env.OPENAI_API_KEY), baseUrlLoopback, customAuth: env.CUSTOM_AUTH,
      localProviderMode: env.GAMECOWORK_LOCAL_PROVIDER_MODE, cliHomePresent: Boolean(env.GAMECOWORK_CLI_HOME),
      resourcesPresent: Boolean(env.GAMECOWORK_CLI_RESOURCE_DIR),
    }) + '\n');
  }
  return original(...args);
};
