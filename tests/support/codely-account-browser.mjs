import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { exerciseOfficialImageBrowser } from './codely-official-image-browser.mjs';

function playwrightModule() {
  try { return createRequire(import.meta.url).resolve('playwright'); } catch {}
  const cache = path.join(process.env.LOCALAPPDATA, 'npm-cache/_npx');
  return fs.readdirSync(cache).map(name => path.join(cache, name, 'node_modules/playwright/index.mjs')).filter(fs.existsSync)
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}
function chromiumPath() {
  const cache = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
  for (const directory of fs.readdirSync(cache).filter(value => /^chromium-\d+$/.test(value)).sort((a,b) => Number(b.split('-')[1]) - Number(a.split('-')[1])))
    for (const file of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe'])
      if (fs.existsSync(path.join(cache, directory, file))) return path.join(cache, directory, file);
  throw new Error('Prepared Chromium runtime is unavailable');
}

export async function exerciseAccountBrowser({ run, frontend, origin, previousGeneration, fixturePort, state, rpc, poll, checks, assertNoSecrets }) {
  const { chromium } = await import(pathToFileURL(playwrightModule()).href);
  const context = await chromium.launchPersistentContext(path.join(run, 'account-browser'), {
    headless: true, executablePath: chromiumPath(), viewport: { width: 1560, height: 1020 },
    locale: 'zh-CN', timezoneId: 'Asia/Shanghai', colorScheme: 'dark', serviceWorkers: 'block',
    args: ['--enable-unsafe-swiftshader'],
  });
  const external = [], pageErrors = [], requests = [], responses = [], responseReads = [], siteReads = [];
  let page, gui;
  const snapshot = async name => {
    if (gui) fs.writeFileSync(path.join(run, name + '.aria.txt'), await gui.locator('body').ariaSnapshot());
    if (page) await page.screenshot({ path: path.join(run, name + '.png'), fullPage: true, animations: 'disabled' });
  };
  try {
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.hostname === '127.0.0.1' || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
      external.push({ origin: url.origin, path: url.pathname }); return route.abort('blockedbyclient');
    });
    if (previousGeneration) await context.route('**/gui.html*', route => route.fulfill({ contentType: 'text/html', body:
      fs.readFileSync(path.join(frontend, 'gui.html'), 'utf8').replaceAll('index-BRxZ4eG7.js', 'index-DvRYaIVa.js')
        .replaceAll('VscTheme-BExNMG_K.js', 'VscTheme-B-CSeuv5.js').replaceAll('store-c6kNGz30.js', 'store-0rGrUshb.js') }));
    await context.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = ''; });
    page = context.pages()[0] || await context.newPage();
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('request', request => {
      if (new URL(request.url()).pathname === '/api/tauri/invoke') {
        try { const raw = request.postDataJSON(), body = raw.message || raw; requests.push({ type: body.messageType, data: body.data, keys: Object.keys(raw) }); } catch {}
      }
    });
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.pathname === '/api/codely-generator/local-session') responseReads.push(response.json().then(body => {
        assertNoSecrets(body, 'Quick browser session response');
        siteReads.push({ site: 'quick', mode: body.mode, username: body.user?.name });
      }).catch(() => {}));
      if (url.pathname === '/api/tauri/invoke') responseReads.push(response.json().then(body => {
        if (['getControlPlaneSessionInfo', 'cancelLogin', 'logoutOfControlPlane', 'controlPlane/openBrowser', 'controlPlane/openUrl'].includes(body.messageType)) responses.push(body);
      }).catch(() => {}));
    });
    await page.goto(origin, { waitUntil: 'domcontentloaded' });
    await poll(() => page.frames().some(frame => frame.url().includes('/gui.html')), 'account GUI iframe mounted');
    gui = page.frames().find(frame => frame.url().includes('/gui.html'));
    const next = gui.getByRole('button', { name: /^(下一步|Next|知道了|Got it)$/ });
    await next.first().waitFor({ state: 'visible', timeout: 3500 }).catch(() => {});
    for (let i = 0; i < 4 && await next.count() && await next.first().isVisible(); i++) await next.first().click();
    await snapshot('account-00-start');
    await gui.getByRole('button', { name: 'GameCowork 本地用户 gamecowork-local' }).click();
    await gui.getByRole('menu').waitFor({ state: 'visible' });
    await gui.getByRole('menuitem', { name: '退出登录', exact: true }).click();
    await gui.getByRole('button', { name: '登出', exact: true }).click();
    await poll(async () => !(await gui.getByRole('menuitem', { name: '退出登录', exact: true }).count()), 'local account logout menu closed');
    await new Promise(resolve => setTimeout(resolve, 700));
    const login = gui.getByRole('button', { name: '登录 / 注册', exact: true });
    await login.waitFor({ state: 'visible' });
    state.initiateFailure = true;
    await login.click();
    await gui.getByText(/登录失败|暂不可用|授权失败|官方授权服务返回 503/).first().waitFor({ state: 'visible', timeout: 15000 });
    await login.waitFor({ state: 'visible' });
    assert.notEqual((await rpc('codelyAccount/status')).phase, 'authenticated');
    await snapshot('account-01-initiate-failed');
    checks.push('Original account login shows an initiate failure without reporting local-mode success');
    state.initiateFailure = false;
    state.initiateDelay = 3500;
    state.authorizeAfterPolls = 100000;
    await login.click();
    await gui.getByText('E2EV-CODE', { exact: true }).waitFor({ state: 'visible', timeout: 15000 });
    const verification = gui.getByRole('link', { name: `http://127.0.0.1:${fixturePort}/auth/device`, exact: true });
    assert.equal(await verification.getAttribute('href'), `http://127.0.0.1:${fixturePort}/auth/device`);
    await verification.click();
    await poll(() => responses.some(value => value.messageType === 'controlPlane/openBrowser' && value.data?.status === 'success'), 'visible verification link reaches the real openBrowser RPC');
    assert.ok(requests.some(value => value.type === 'controlPlane/openBrowser' && value.data?.path === `http://127.0.0.1:${fixturePort}/auth/device?user_code=E2EV-CODE`));
    await snapshot('account-02-device-code');
    assert.equal((await rpc('codelyAccount/status')).phase, 'awaiting-authorization');
    await gui.getByRole('button', { name: '取消', exact: true }).click();
    await login.waitFor({ state: 'visible' });
    await poll(async () => (await rpc('codelyAccount/status')).phase === 'logged-out', 'original cancel stops the actual broker flow');
    assert.equal(await gui.getByText('E2EV-CODE', { exact: true }).count(), 0);
    checks.push('Original device authorization remains pending after a delayed initiate, shows its link/code and cancels through the broker');
    state.initiateDelay = 0;
    state.authorizeAfterPolls = 1;
    await login.click();
    const account = gui.getByRole('button', { name: /e2e-codely-user/ });
    await account.waitFor({ state: 'visible', timeout: 30000 });
    await poll(async()=>(await account.textContent()).includes('Pro'),'original account badge reflects the actual active Pro plan');
    await account.click();
    const accountMenu=gui.getByRole('menu').first();
    await accountMenu.getByText(state.noEmail?'账号 ID: 64001':'邮箱: e2e-user@example.invalid',{exact:true}).waitFor({state:'visible'});
    assert.equal(await accountMenu.getByText(/邮箱.*64001/).count(),0,'The original account menu must not call its numeric UID an email');
    const usageMenu=accountMenu.locator('[data-telemetry-id="credits_menu"]');
    if(await usageMenu.count()) {await usageMenu.hover();await gui.locator('[data-telemetry-id="view_credits"]').first().waitFor({state:'visible'});await gui.locator('[data-telemetry-id="view_credits"]').first().click();}
    else await accountMenu.locator('[data-telemetry-id="view_credits"]').click();
    await poll(()=>requests.some(value=>value.type==='controlPlane/openUrl'&&value.data?.path==='dashboard/usage'),'original credits arrow sends its existing public usage RPC');
    await poll(()=>responses.some(value=>value.messageType==='controlPlane/openUrl'&&value.data?.status==='success'),'public usage RPC completes through the actual Core and test host');
    checks.push('Original account menu shows a real username, actual email or explicit account ID, active Pro badge and the original usage-link RPC');
    await snapshot('account-03-authenticated');
    assert.equal((await rpc('codelyAccount/status')).phase, 'authenticated');
    await gui.getByRole('button', { name: 'AI资产生成', exact: true }).click();
    await poll(() => gui.childFrames().some(frame => new URL(frame.url()).pathname === '/lab3d'), 'original Quick client mounts');
    const quick = gui.childFrames().find(frame => new URL(frame.url()).pathname === '/lab3d');
    if(state.imageEnabled) await exerciseOfficialImageBrowser({page,gui,quick,run,origin,state,poll,checks});
    await gui.getByRole('tab', { name: '画布', exact: true }).click();
    await poll(() => gui.childFrames().some(frame => frame.url().includes('/codely-canvas/')), 'existing original Canvas client mounts');
    const canvas = gui.childFrames().find(frame => frame.url().includes('/codely-canvas/'));
    await canvas.getByRole('button', { name: /新建无限画布|空白画布/ }).first().waitFor({ state: 'visible', timeout: 30000 });
    const identity = () => canvas.evaluate(() => {
      // Observe the actual mounted provider. This never dispatches, sets hooks,
      // manufactures identity, calls getAccessToken or reads persisted storage.
      const root = document.getElementById('root');
      const key = Object.keys(root).find(name => name.startsWith('__reactContainer$'));
      const attached = key && root[key], current = attached?.stateNode?.current || attached;
      const pending = current ? [current] : [], seen = new Set();
      while (pending.length) {
        const fiber = pending.pop(); if (!fiber || seen.has(fiber)) continue; seen.add(fiber);
        if (fiber.type?.name === 'CanvasLocalAuthProvider') {
          const session = fiber.memoizedState?.memoizedState;
          return { local: !!session, official: !!session?.official, username: session?.official?.user?.username || session?.user?.username, points: session?.official?.points || null };
        }
        pending.push(fiber.child, fiber.sibling);
      }
      return null;
    });
    await poll(async () => (await identity())?.username === 'e2e-codely-user', 'actual Canvas provider uses the broker identity');
    const beforeLogout = siteReads.length;
    await rpc('logoutOfControlPlane');
    await poll(async () => (await identity())?.official === false, 'already mounted Canvas resets on account logout');
    await poll(() => siteReads.slice(beforeLogout).some(value => value.mode === 'gamecowork-local'), 'already mounted Quick reloads its local identity');
    await poll(async () => {
      const label = await gui.getByRole('button', { name: /GameCowork 本地用户/ }).textContent();
      return !/\bPro\b|E2E Main Org/.test(label);
    }, 'local account UI clears the previous official plan badge and organization');
    assert.equal(canvas.isDetached(), false); assert.equal(quick.isDetached(), false);
    await snapshot('account-04-mounted-sites-local');
    const beforeLogin = siteReads.length;
    state.authorizeAfterPolls = 1;
    await rpc('getControlPlaneSessionInfo', { silent: false, useOnboarding: false });
    await poll(async () => (await identity())?.username === 'e2e-codely-user', 'already mounted Canvas receives a later official login');
    await poll(() => siteReads.slice(beforeLogin).some(value => value.mode === 'codely-official'), 'already mounted Quick reloads official identity');
    assert.deepEqual((await identity()).points, { points: 500, total: 800 });
    assert.equal(canvas.isDetached(), false); assert.equal(quick.isDetached(), false);
    checks.push('Already mounted original Quick and Canvas clients reload official identity on login and clear it on logout without iframe replacement');
    checks.push('Account downgrade to local mode clears the previous official plan badge and organization in the actual GUI');
    await account.click();
    await gui.getByRole('menuitem', { name: '退出登录', exact: true }).click();
    await gui.getByRole('button', { name: '登出', exact: true }).click();
    await login.waitFor({ state: 'visible' });
    await snapshot('account-05-logged-out');
    checks.push('Fixture authorization updates the original account UI and its logout returns to the original login screen');
    assert.equal(external.length, 0, 'Account browser must never request an external host');
    assert.deepEqual(pageErrors, []);
    checks.push('Both browser and Core account verification stay on loopback, with the system browser open suppressed by the test host');
  } catch (error) {
    await snapshot('account-failure').catch(() => {}); throw error;
  } finally {
    await Promise.allSettled(responseReads);
    try {
      assertNoSecrets({ requests, responses, siteReads }, 'browser evidence');
      fs.writeFileSync(path.join(run, 'browser-evidence.json'), JSON.stringify({ previousGeneration, external, pageErrors, requests, responses, siteReads }, null, 2));
    } finally { await context.close(); }
  }
}
