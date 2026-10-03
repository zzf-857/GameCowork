import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Execute the actual login callback, validators, timeout table and messenger
// method from both maintained clients. Stub only the request and React state
// setters: a second implementation cannot prove that the shipped callback settles.
const generations = [
  { name: 'current', file: 'VscTheme-BExNMG_K.js', timeoutTable: 'Mgn', timeoutBase: 'Tgn', messenger: 'Kl', joined: 's5e' },
  { name: 'previous', file: 'VscTheme-B-CSeuv5.js', timeoutTable: 'Cgn', timeoutBase: 'wgn', messenger: 'Yl', joined: 'l5e' },
];

function between(source, start, end) {
  const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `Missing actual source boundary: ${start}`);
  return source.slice(a, b);
}

function namedFunction(source, name) {
  return between(source, `function ${name}(`, '\n}') + '\n}';
}

function fixture(spec, request) {
  const source = fs.readFileSync(new URL(`../../src/frontend/bundle/assets/${spec.file}`, import.meta.url), 'utf8');
  const login = between(source, '      S = async (O) => {', ',\n      T = async').trim().slice('S = '.length);
  const timeoutTable = between(source, `  ${spec.timeoutTable} = {`, '\n  },').trim() + '\n};';
  const timeoutMethod = between(source, '  getRequestTimeout(t) {', '\n  request(t, n)').trim();
  const defaultTimeout = source.match(new RegExp(`Vt\\(${spec.messenger}, "DEFAULT_REQUEST_TIMEOUT_MS", ([^)]+)\\)`));
  assert.ok(defaultTimeout, 'Actual messenger default timeout must be present');
  const state = { loading: [], errors: [], flow: [], sessions: [], calls: [] };
  const context = vm.createContext({
    Error,
    n: { request: (...args) => { state.calls.push(args); return request(...args); } },
    l: value => state.loading.push(value),
    f: value => state.errors.push(value),
    h: value => state.flow.push(value),
    o: value => state.sessions.push(value),
    [spec.timeoutBase]: 60000,
    [spec.messenger]: { DEFAULT_REQUEST_TIMEOUT_MS: Number(defaultTimeout[1]) },
  });
  vm.runInContext(`
    ${namedFunction(source, 'y$')}
    ${namedFunction(source, spec.joined)}
    ${namedFunction(source, 'Mx')}
    const ${timeoutTable}
    globalThis.login = ${login};
    globalThis.timeout = ({ ${timeoutMethod} }).getRequestTimeout;
  `, context);
  return { state, login: context.login, timeout: context.timeout };
}

const officialSession = { accessToken: 'local-official-handle', account: { id: 'fixture-official', label: 'Fixture official' }, mode: 'codely' };
const localSession = { accessToken: 'gamecowork-local-session', account: { id: 'gamecowork-local', label: 'GameCowork 本地用户' }, mode: 'local' };

function sessionFixture(spec, request = async () => ({ status: 'success', content: localSession })) {
  const source = fs.readFileSync(new URL(`../../src/frontend/bundle/assets/${spec.file}`, import.meta.url), 'utf8');
  const authSource = source.slice(source.indexOf('      S = async (O) => {'));
  const callback = between(authSource, '        "sessionUpdate",\n', '\n        [n,').slice('        "sessionUpdate",\n'.length).trim().replace(/,$/, '');
  const activityOwner = between(authSource, '      w =\n', ';\n    E.useEffect').slice('      w =\n'.length);
  const resetReducer = between(source, '      resetAccountState: (e) => {', '\n      setPlanInfo:').trim();
  const organizationsReducer = between(source, '      setOrganizations: (e, { payload: t }) => {', '\n      setSelectedOrgId:').trim();
  const selectedOrgReducer = between(source, '      setSelectedOrgId: (e, { payload: t }) => {', '\n      initializeProfilePreferences:').trim();
  const personal = { id: 'personal', profiles: [{ id: 'local-profile' }], selectedProfileId: 'local-profile' };
  const remote = { id: 'fixture-org', profiles: [{ id: 'official-profile' }], selectedProfileId: 'official-profile' };
  const state = {
    profiles: { organizations: [personal, remote], selectedOrganizationId: remote.id, selectedProfileId: 'official-profile' },
    account: { organizations: [{ id: remote.id, name: 'E2E Main Org' }], currentOrgId: remote.id, currentOrgName: 'E2E Main Org',
      multiTeamEnabled: true, planType: 'pro', planTag: 'Pro', isPlanActive: true, isTeamPlan: true,
      usageRemainingPoints: '54321', isUsageExhausted: true, usageWindows: [{ remainingPoints: '54321' }], lastPlanFetchAt: Date.now(),
      runningRunners: { fixture: true } },
    stopped: [], calls: [], sessions: [], actions: [], visibleSession: officialSession,
  };
  let context;
  context = vm.createContext({
    i: officialSession, g: { current: 1 }, gamecoworkSessionUpdateGeneration: { current: 0 }, x: state.profiles.organizations,
    n: { request: (...args) => { state.calls.push(args); return request(...args); }, post: () => { throw new Error('session invalidation must not log out again'); } },
    t: action => {
      state.actions.push(action.type);
      if (action.type === 'profiles/setOrganizations') context.profileReducers.setOrganizations(state.profiles, action);
      else if (action.type === 'profiles/setSelectedOrgId') context.profileReducers.setSelectedOrgId(state.profiles, action);
      else if (action.type === 'account/resetAccountState') context.accountReducers.resetAccountState(state.account, action);
      else throw new Error(`Unexpected action ${action.type}`);
    },
    O9e: payload => ({ type: 'profiles/setOrganizations', payload }),
    L9e: payload => ({ type: 'profiles/setSelectedOrgId', payload }),
    V9e: () => ({ type: 'account/resetAccountState' }),
    a: runner => state.stopped.push(runner), to: { ConfigPolling: 'config', ActivityPolling: 'activity' },
    o: value => { state.sessions.push(value); state.visibleSession = value; }, l() {}, h() {}, f() {},
  });
  vm.runInContext(`
    ${namedFunction(source, 'y$')}
    ${namedFunction(source, spec.joined)}
    ${namedFunction(source, 'Mx')}
    ${namedFunction(source, 'Pkt')}
    ${namedFunction(source, 'lS')}
    globalThis.profileReducers = { ${organizationsReducer} ${selectedOrgReducer} };
    globalThis.accountReducers = { ${resetReducer} };
    globalThis.sessionUpdate = ${callback};
    globalThis.activityOwner = (i) => { let F, L, I; return ${activityOwner}; };
  `, context);
  return { state, sessionUpdate: context.sessionUpdate, activityOwner: context.activityOwner };
}

function assertLocalAccountState(state) {
  assert.deepEqual(Array.from(state.profiles.organizations, org => org.id), ['personal']);
  assert.equal(state.profiles.selectedOrganizationId, 'personal');
  assert.equal(state.profiles.selectedProfileId, 'local-profile');
  for (const key of ['currentOrgId', 'currentOrgName', 'planType', 'planTag', 'usageRemainingPoints', 'lastPlanFetchAt']) assert.equal(state.account[key], null, key);
  for (const key of ['isPlanActive', 'isTeamPlan', 'isUsageExhausted', 'multiTeamEnabled']) assert.equal(state.account[key], false, key);
  assert.equal(state.account.organizations.length, 0);
  assert.equal(state.account.usageWindows.length, 0);
  assert.deepEqual(state.account.runningRunners, { fixture: true }, 'existing runner bookkeeping is preserved by the original reset reducer');
}

for (const spec of generations) {
  test(`${spec.name}: login network rejection settles false, ends loading and reports the error`, async () => {
    const f = fixture(spec, async () => { throw new Error('fixture connection closed'); });
    assert.equal(await f.login(true), false);
    assert.deepEqual(f.state.loading, [true, false]);
    assert.deepEqual(f.state.flow, [null]);
    assert.deepEqual(f.state.errors, [null, 'fixture connection closed']);
    assert.deepEqual(f.state.sessions, []);
    assert.equal(f.state.calls[0][0], 'getControlPlaneSessionInfo');
    assert.equal(f.state.calls[0][1].silent, false);
    assert.equal(f.state.calls[0][1].useOnboarding, true);
  });

  test(`${spec.name}: login has time to receive the host's bounded failure response`, () => {
    const f = fixture(spec, async () => ({}));
    assert.equal(f.timeout('getControlPlaneSessionInfo'), 40000);
    const shell = fs.readFileSync(new URL('../../src/shell/src/main.rs', import.meta.url), 'utf8');
    const hostTimeout = shell.match(/Duration::from_secs\(if interactive \{ (\d+) \} else \{ (\d+) \}\)/);
    assert.ok(hostTimeout, 'Interactive and silent host budgets are explicit');
    assert.ok(f.timeout('getControlPlaneSessionInfo') > Number(hostTimeout[1]) * 1000);
    assert.equal(Number(hostTimeout[2]), 3);
    assert.equal(f.timeout('unrelated-fixture-message'), 30000);
  });

  test(`${spec.name}: joined device flow stays loading; error and completed login settle correctly`, async () => {
    const joined = fixture(spec, async () => ({ status: 'success', content: { joinedInProgress: true } }));
    assert.equal(await joined.login(false), false);
    assert.deepEqual(joined.state.loading, [true]);
    assert.deepEqual(joined.state.flow, []);

    const failure = fixture(spec, async () => ({ status: 'error', error: 'fixture official failure' }));
    assert.equal(await failure.login(false), false);
    assert.deepEqual(failure.state.loading, [true, false]);

    const session = { accessToken: 'local-display-handle', account: { id: 'fixture-id', label: 'Fixture' }, mode: 'codely' };
    const success = fixture(spec, async () => ({ status: 'success', content: session }));
    assert.equal(await success.login(false), true);
    assert.deepEqual(success.state.sessions, [session]);
    assert.deepEqual(success.state.loading, [true, false]);
  });

  test(`${spec.name}: official-to-local session update clears real profile/account reducers without another logout`, async () => {
    const f = sessionFixture(spec);
    await f.sessionUpdate({ sessionInfo: localSession });
    assertLocalAccountState(f.state);
    assert.deepEqual(f.state.stopped, ['config', 'activity']);
    assert.deepEqual(f.state.calls, []);
    assert.equal(f.state.sessions.at(-1), localSession);
    assert.equal(f.activityOwner(localSession), undefined, 'local identity cannot restart official account polling');
    assert.equal(f.activityOwner(officialSession), officialSession.account.id);
  });

  test(`${spec.name}: invalidation clears entitlements before the silent local fallback completes or fails`, async () => {
    let release;
    const f = sessionFixture(spec, () => new Promise(resolve => { release = resolve; }));
    const pending = f.sessionUpdate({ sessionInfo: null });
    assertLocalAccountState(f.state);
    assert.deepEqual(f.state.sessions, [], 'keep mounted asset views while the local replacement is pending');
    assert.equal(f.state.visibleSession, officialSession);
    assert.equal(f.state.calls[0][1].silent, true);
    release({ status: 'success', content: localSession });
    await pending;
    assert.equal(f.state.sessions.at(-1), localSession);
    assert.deepEqual(f.state.sessions, [localSession], 'publish the replacement once without an intermediate empty identity');
    const failed = sessionFixture(spec, async () => { throw new Error('fixture core unavailable'); });
    await failed.sessionUpdate({ sessionInfo: null });
    assertLocalAccountState(failed.state);
    assert.equal(failed.state.sessions.at(-1), undefined);
    assert.equal(failed.state.visibleSession, undefined);
  });

  test(`${spec.name}: a late silent fallback cannot replace a newer authenticated session`, async () => {
    let release;
    const f = sessionFixture(spec, () => new Promise(resolve => { release = resolve; }));
    const pending = f.sessionUpdate({ sessionInfo: null });
    const next = { ...officialSession, account: { id: 'new-fixture-user', label: 'New fixture user' } };
    await f.sessionUpdate({ sessionInfo: next });
    release({ status: 'success', content: localSession });
    await pending;
    assert.equal(f.state.visibleSession, next);
    assert.deepEqual(f.state.sessions, [next]);
  });

  test(`${spec.name}: official session updates preserve live official account state`, async () => {
    const f = sessionFixture(spec);
    await f.sessionUpdate({ sessionInfo: officialSession });
    assert.equal(f.state.account.planTag, 'Pro');
    assert.equal(f.state.account.currentOrgName, 'E2E Main Org');
    assert.deepEqual(f.state.actions, []);
    assert.deepEqual(f.state.stopped, []);
    assert.equal(f.state.sessions.at(-1), officialSession);
  });
}
