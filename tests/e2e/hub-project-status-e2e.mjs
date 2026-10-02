// Run the shared real HTTP discovery harness with Chromium user-flow checks.
process.argv.push('--browser');
await import('../integration/hub-refresh.mjs');
