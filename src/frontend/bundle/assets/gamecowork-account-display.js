// Presentation of the broker's public account DTO. This helper does not read
// credentials, fetch another identity, or infer membership from IDs/balances.
const safeText = value => typeof value === 'string' && value.trim() && value.length <= 320 && !/[\u0000-\u001f\u007f]/.test(value) ? value.trim() : '';
const emailText = value => {
  const text = safeText(value);
  return text && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? text : '';
};
export function gamecoworkAccountDisplay(session, plan = {}, language = 'zh') {
  const english = String(language).startsWith('en'), account = session?.account || {};
  const id = safeText(account.id), username = safeText(account.username), label = safeText(account.label), email = emailText(account.email);
  const official = session?.mode === 'codely' && !!id && !!label;
  const local = session?.mode === 'local' && !!id && !!label;
  const displayName = official ? username || (label !== id ? label : '') || email || (english ? 'Codely user' : 'Codely 用户') : local ? label : '';
  const detailLabel = official ? email ? english ? 'Email' : '邮箱' : english ? 'Account ID' : '账号 ID' : local ? english ? 'Local account' : '本地账号' : '';
  const detailValue = official ? email || id : local ? id : '';
  const type = safeText(plan.planType).toLowerCase().replace(/_/g, '-'), tag = safeText(plan.planTag).toLowerCase();
  const active = Object.hasOwn(plan, 'isActive') ? plan.isActive === true : plan.isPlanActive === true;
  const deniedSeat = plan.isTeamPlan === true && plan.hasSeat === false;
  const pro = ['pro', 'personal-pro', 'team-pro'].includes(type) || !type && ['pro', 'tuanjieaipro'].includes(tag);
  const planBadge = official && active && !deniedSeat ? pro ? 'Pro' : ['free', 'max', 'enterprise'].includes(type) ? type[0].toUpperCase() + type.slice(1) : '' : '';
  return Object.freeze({ official, local, id, displayName, displayEmail: email,
    displaySubtext: official ? `${detailLabel}: ${detailValue}` : local ? id : '',
    accountDetail: detailValue ? `${detailLabel}: ${detailValue}` : '', accountDetailValue: detailValue, planBadge });
}
export function gamecoworkOpenAccountUsage(session, messenger) {
  if (!gamecoworkAccountDisplay(session).official || typeof messenger?.post !== 'function') return false;
  // The authenticated Core maps this original public path to the fixed official
  // website. The renderer neither accepts a caller-supplied URL nor opens it.
  messenger.post('controlPlane/openUrl', { path: 'dashboard/usage', orgSlug: undefined });
  return true;
}
