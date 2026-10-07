import assert from 'node:assert/strict';

// Exercise the actual original two-level menu, including its hover transitions.
// Expectations are supplied by the canonical fixture, never derived from raw IDs.
export async function closeChatModelMenu(gui) {
  const root=gui.locator('[data-telemetry-id="model_cascade_menu"]');
  if(await root.isVisible())await gui.locator('[data-telemetry-id="model_select"]').first().click();
  await root.waitFor({state:'hidden'});
}

export async function openChatModelOptions(gui) {
  const root=gui.locator('[data-telemetry-id="model_cascade_menu"]');
  if(!await root.isVisible())await gui.locator('[data-telemetry-id="model_select"]').first().click();
  await root.waitFor({state:'visible'});
  const row=root.getByText(/^(模型|Model)$/,{exact:true});
  if(await row.count()) {
    await row.first().hover();
    const submenu=gui.locator('[data-telemetry-id="model_cascade_submenu"]');
    await submenu.waitFor({state:'visible'});return submenu;
  }
  return root;
}

export function chatModelRow(panel,title) {
  return panel.getByText(title,{exact:true}).locator('xpath=ancestor::button[1]');
}

export async function chooseChatModel(gui,title,poll,readState) {
  const panel=await openChatModelOptions(gui),row=chatModelRow(panel,title);
  assert.equal(await row.count(),1,'One native model row: '+title);
  assert.equal(await row.isEnabled(),true,'Selected model is enabled: '+title);
  await row.click();await poll(async()=>(await readState()).selected===title,'selected '+title);
}

export async function chooseChatReasoning(gui,value,poll,readReasoning) {
  const root=gui.locator('[data-telemetry-id="model_cascade_menu"]');
  if(!await root.isVisible())await gui.locator('[data-telemetry-id="model_select"]').first().click();
  await root.waitFor({state:'visible'});await root.getByText(/^(推理|Reasoning)$/,{exact:true}).hover();
  const submenu=gui.locator('[data-telemetry-id="model_cascade_submenu"]');await submenu.waitFor({state:'visible'});
  const label=value.charAt(0).toUpperCase()+value.slice(1),option=submenu.getByRole('button',{name:label,exact:true});
  assert.equal(await option.count(),1,'Original reasoning option exists: '+label);await option.click();
  await poll(async()=>await readReasoning()===value,'native reasoning '+value);
}

export async function assertCanonicalChatMenu({gui,models,customTitle,checks,wireRequestCount,keyRequestCount,readSelected}) {
  const panel=await openChatModelOptions(gui);
  assert.equal(await panel.getByText(/^(内置模型|Built-in Models)$/,{exact:true}).count(),1,'One native built-in group');
  assert.equal(await panel.getByText('Codely 官方 · Pro',{exact:true}).count(),0,'No duplicate official custom group');
  assert.equal(await panel.getByText(/^(启用|刷新) Codely 官方 · Pro 模型$/,{exact:true}).count(),0,'No enable/refresh placeholder in the native catalog');
  assert.equal(await panel.getByText(/^(添加自定义模型|Add Custom Model)$/,{exact:true}).count(),1,'Original add-custom footer remains');
  const position=row=>row.evaluate(node=>{const owner=node.closest('[data-telemetry-id="model_cascade_submenu"]')||node.closest('[data-telemetry-id="model_cascade_menu"]');return [...owner.querySelectorAll('button')].indexOf(node);});
  const positions=[];
  for(const model of models) {
    const row=chatModelRow(panel,model.title);assert.equal(await row.count(),1,'Canonical row: '+model.title);
    assert.equal(await row.isDisabled(),!!model.disabled,'Server/native disabled flag: '+model.title);
    assert.equal(await row.locator('[data-testid="model-logo-custom"]').count(),0,'Built-in row cannot become custom: '+model.title);
    if(model.logoTestId)assert.equal(await row.locator(`[data-testid="${model.logoTestId}"]`).count(),1,'Original canonical logo: '+model.title);
    if(model.rateText)assert.ok((await row.textContent()).includes(model.rateText),'Canonical rate label: '+model.title);
    if(model.disabled)assert.doesNotMatch(await row.textContent(),/\d(?:\.\d+)?x(?:\s|$)/,'Disabled placeholder does not imply an enabled billing rate');
    positions.push(await position(row));
  }
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b),'Service order remains the native order');assert.ok(positions.every(index=>index>=0));
  if(customTitle) {
    const row=chatModelRow(panel,customTitle);assert.equal(await row.count(),1,'Existing custom model remains');
    assert.equal(await row.locator('[data-testid="model-logo-custom"]').count(),1);assert.doesNotMatch(await row.textContent(),/\d(?:\.\d+)?x(?:\s|$)/);
    assert.ok(await position(row)>positions.at(-1),'Custom Provider remains below the built-in group');
  }
  const frontier=models.find(model=>model.title==='Frontier');
  if(frontier) {
    const count=wireRequestCount(),keys=keyRequestCount?.(),selected=await readSelected?.(),row=chatModelRow(panel,frontier.title);assert.equal(frontier.disabled,true);
    // A real pointer click on a disabled HTML button must not dispatch selection.
    await row.click({force:true});assert.equal(wireRequestCount(),count,'Disabled Frontier never submits inference');
    if(keyRequestCount)assert.equal(keyRequestCount(),keys,'Disabled Frontier cannot obtain an inference key');
    if(readSelected)assert.equal(await readSelected(),selected,'Disabled Frontier cannot alter selected model');
  }
  checks.push('Canonical built-in order, logos, rates, disabled Frontier and original custom footer use the actual native menu');
  return panel;
}
