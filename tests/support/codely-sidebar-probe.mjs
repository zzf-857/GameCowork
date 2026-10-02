import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const sha = value => createHash('sha256').update(value).digest('hex');
const conflictText = '画布已在其他位置打开，请关闭后才能操作';
const assetEntry = /^(AI资产生成|AI 资产生成|AI Asset Generation)$/;
const canvasTab = /^(画布|Canvas)$/;

async function visible(locator) {
  for (let index = 0; index < await locator.count(); index++) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible()) return candidate;
  }
  return null;
}
async function contentFrame(locator) {
  const element = await locator.elementHandle();
  assert.ok(element, 'The actual iframe element exists');
  try { const frame = await element.contentFrame(); assert.ok(frame, 'The actual iframe browsing context exists'); return frame; }
  finally { await element.dispose(); }
}
async function ownerOf(frame) {
  // Read the maintained local identity seam only. Do not change React/Redux,
  // generate a lease owner, read a Bearer token or inspect global storage.
  return frame.evaluate(async () => {
    const boundary = await import('/codely-canvas/canvas-local-auth.js');
    return boundary.existingCanvasEditingOwner();
  });
}
function isCanvas(frame) {
  try { return new URL(frame.url()).pathname.startsWith('/codely-canvas/'); } catch { return false; }
}
async function returnHome(frame, poll) {
  const back = frame.getByRole('button', { name: '返回', exact: true });
  await back.waitFor({ state: 'visible' });
  await back.click();
  await frame.getByRole('button', { name: '返回工作区', exact: true }).click();
  await poll(async () => !!await visible(frame.getByRole('button', { name: '新建无限画布', exact: true })), 'original Canvas Return to Workspace reaches its gallery');
}
async function openGraph(frame, canvasSaved, poll) {
  await poll(async () =>
    !!await visible(frame.getByRole('button', { name: '返回', exact: true })) ||
    !!await visible(frame.getByRole('button', { name: '新建无限画布', exact: true })) ||
    !!await visible(frame.getByText(canvasSaved.name, { exact: true })), 'the original sidebar Canvas entry settles');
  if (await visible(frame.getByRole('button', { name: '返回', exact: true }))) {
    if (new URL(frame.url()).pathname.endsWith('/canvasid=' + canvasSaved.id)) return;
    // The real workspace-aware host can auto-open its associated blank canvas.
    // Leave it using the original menu before selecting the shared test graph.
    await returnHome(frame, poll);
  }
  const card = frame.getByText(canvasSaved.name, { exact: true }).first();
  await card.waitFor({ state: 'visible' });
  await card.click();
}

/**
 * Call after restartAndCheck(), before the optional flexible-layout probe.
 * Requires the driver's already-created own chat containing `Hello fixture`,
 * and canvasSaved {id,name,node:{id}}. Uses the shipped default right-sidebar
 * menu. Every action is a real locator click/input; no product state injection.
 * Returns {canvas,evidence}; persist evidence only, never the Frame object.
 */
export async function probeDefaultSidebarCanvas({
  gui, page, poll, snapshot, canvasStore, canvasSaved, check, api,
  selectOwnedChat, prefix = 'default-sidebar', text = 'OWNED_CANVAS_DEFAULT_SIDEBAR_TEXT',
}) {
  assert.notEqual(new URL(gui.url()).searchParams.get('flexibleLayout'), '1', 'Default-sidebar probe must run without the optional flexibleLayout flag');
  const id = canvasSaved.id, lockPath = '/codely-canvas/api/v1/canvas-locks/' + id;
  const events = [], reads = [], frames = new WeakMap(); let nextFrame = 0;
  const frameId = frame => { if (!frames.has(frame)) frames.set(frame, ++nextFrame); return frames.get(frame); };
  const observe = response => {
    const request = response.request(), url = new URL(response.url());
    if (!url.pathname.startsWith('/codely-canvas/api/v1/canvas-locks/')) return;
    let owner;
    try { owner = request.postDataJSON()?.session_id; } catch {}
    const event = { path: url.pathname, method: request.method(), status: response.status(), frameId: frameId(request.frame()), ownerHash: typeof owner === 'string' ? sha(owner) : null };
    events.push(event);
    if (request.method() !== 'DELETE') reads.push(response.json().then(body => { event.code = body.code; event.acquired = body.data?.acquired; }).catch(() => { event.responseUnavailable = true; }));
  };
  page.on('response', observe);
  const report = (label, condition) => { assert.ok(condition, label); check?.(label, condition); };
  const capture = (name, frame) => snapshot(prefix + '-' + name, frame);
  const selectChat = selectOwnedChat || (async () => {
    await gui.locator('[data-telemetry-id="history_session"]').first().click();
    await gui.locator('main').getByText('Hello fixture', { exact: false }).waitFor({ state: 'visible' });
  });
  const showAssets = async () => {
    await gui.getByRole('button', { name: assetEntry }).first().click();
    await gui.getByRole('tab', { name: canvasTab }).click();
    await gui.getByTestId('canvas-frame').waitFor({ state: 'visible' });
    return contentFrame(gui.getByTestId('canvas-frame'));
  };
  const showSidebar = async () => {
    const existing = await visible(gui.getByTestId('right-sidebar-canvas-frame'));
    if (existing) return contentFrame(existing);
    let extension = await visible(gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]'));
    if (!extension) {
      const toggle = await visible(gui.locator('[data-telemetry-id="toggle_right_sidebar"]'));
      assert.ok(toggle, 'The normal chat header exposes its real right-sidebar toggle');
      await toggle.click();
      await poll(async () => !!await visible(gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]')), 'the normal right-sidebar extension menu becomes visible');
      extension = await visible(gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]'));
    }
    await extension.click();
    const item = gui.getByRole('menuitem', { name: /^(AI\s*画布|AI\s*Canvas|画布)$/i });
    await item.waitFor({ state: 'visible' });
    await item.click();
    const iframe = gui.getByTestId('right-sidebar-canvas-frame');
    await iframe.waitFor({ state: 'visible' });
    const frame = await contentFrame(iframe);
    await poll(() => isCanvas(frame), 'the default right-sidebar menu loads the actual local Canvas');
    assert.equal(new URL(frame.url()).origin, new URL(gui.url()).origin, 'Sidebar Canvas uses the real same-origin source adapter');
    return frame;
  };
  const savedText = () => {
    const record = canvasStore().assets[id];
    assert.ok(record, 'The real persisted own Canvas still exists');
    return JSON.parse(record.graph).nodes.find(node => node.id === canvasSaved.node.id)?.data.textContent?.map(value => value.text).join('') || '';
  };

  try {
    const first = await showAssets();
    await openGraph(first, canvasSaved, poll);
    await first.locator('.react-flow__node[data-id="' + canvasSaved.node.id + '"]').waitFor({ state: 'visible' });
    await poll(async () => !!await ownerOf(first), 'the original Assets Canvas has a document editing owner');
    const firstOwner = await ownerOf(first), firstHash = sha(firstOwner), firstId = frameId(first);
    await selectChat();
    let second = await showSidebar();
    assert.notEqual(first, second, 'The sidebar menu opened an independent iframe');
    await openGraph(second, canvasSaved, poll);
    await second.getByText(conflictText, { exact: true }).waitFor({ state: 'visible' });
    const secondOwner = await ownerOf(second);
    assert.ok(secondOwner, 'The second original client invoked its actual lease-owner boundary');
    const secondHash = sha(secondOwner), secondId = frameId(second);
    assert.notEqual(firstHash, secondHash, 'Same-host Canvas documents have independent owners');
    const evidence = { entry: 'default-right-sidebar-extension-menu', defaultLayout: true,
      firstFrame: firstId, firstOwnerHash: firstHash, secondFrame: secondId, secondOwnerHash: secondHash,
      firstDocumentPreserved: !first.isDetached(), originalClientConflictVisible: true };
    report('Default right-sidebar AI Canvas preserves the hidden Assets document and blocks its distinct editing owner', !first.isDetached() && gui.childFrames().filter(isCanvas).length >= 2);
    if (api) {
      // Supplemental native negative: the original BroadcastChannel/storage
      // guard may reject before acquire HTTP. Never alter either client's state.
      const local = await api('/codely-canvas/api/local/session');
      assert.equal(local.status, 200);
      const denied = await api(lockPath + '/acquire', { method: 'POST', headers: { Authorization: 'Bearer ' + local.body.session.id }, body: { session_id: secondOwner, force: false } });
      assert.equal(denied.status, 200); assert.equal(denied.body.data.acquired, false);
      evidence.nativeNegative = { status: denied.status, acquired: denied.body.data.acquired };
    }
    await capture('01-conflict', second);
    assert.equal(await showAssets(), first, 'Returning to Assets reuses the actual retained document');
    await returnHome(first, poll);
    await poll(() => events.some(event => event.path === lockPath && event.method === 'DELETE' && event.ownerHash === firstHash && event.status === 200), 'the original Assets return menu sends its native lease release; subsequent acquisition verifies the effect');
    evidence.secondSurvivedAssetNavigation = !second.isDetached();
    await selectChat(); second = await showSidebar();
    const retry = await visible(second.getByRole('button', { name: '重试', exact: true }));
    if (retry) await retry.click(); else await openGraph(second, canvasSaved, poll);
    await second.getByText(conflictText, { exact: true }).waitFor({ state: 'hidden' });
    const resumedOwner = await ownerOf(second), resumedHash = sha(resumedOwner);
    await poll(() => events.some(event => event.path === lockPath + '/acquire' && event.ownerHash === resumedHash && event.status === 200 && event.acquired === true), 'the default sidebar document actually acquires the released native lease');
    evidence.resumedFrame = frameId(second); evidence.resumedOwnerHash = resumedHash;
    await second.getByRole('button', { name: '适应画布', exact: true }).click();
    const node = second.locator('.react-flow__node[data-id="' + canvasSaved.node.id + '"]');
    await node.click();
    const enlarge = node.locator('._toolbar_16xzv_235 > ._toolbarBtnWrap_16xzv_250').nth(3);
    await enlarge.hover(); await enlarge.getByRole('button').click();
    const editor = second.locator('.markdown-editor-content[contenteditable="true"]');
    await editor.fill(text);
    await second.locator('[data-overlay-window]').filter({ has: editor }).getByTitle('关闭', { exact: true }).click();
    await poll(() => savedText() === text, 'the original sidebar text editor saves actual graph bytes');
    report('Default sidebar Canvas takes the released lease and saves text through the original editor and real native store', resumedHash !== firstHash && await node.getByText(text, { exact: true }).isVisible());
    await capture('02-takeover-saved', second);
    assert.equal(await showAssets(), first, 'The first original Assets document remains independently addressable');
    await openGraph(first, canvasSaved, poll);
    if (!second.isDetached()) {
      await first.getByText(conflictText, { exact: true }).waitFor({ state: 'visible' });
      evidence.oldDocumentBlocked = true;
    } else {
      await first.locator('.react-flow__node[data-id="' + canvasSaved.node.id + '"]').getByText(text, { exact: true }).waitFor({ state: 'visible' });
      evidence.oldDocumentLoadedLatest = true;
    }
    report('Revisiting the original Assets document cannot overwrite the default-sidebar saved graph', savedText() === text && (evidence.oldDocumentBlocked || evidence.oldDocumentLoadedLatest));
    await capture('03-no-overwrite', first);
    await Promise.allSettled(reads);
    evidence.leaseEvents = events;
    return { canvas: first, sidebarCanvas: second, evidence };
  } finally {
    page.off('response', observe);
    await Promise.allSettled(reads);
  }
}
