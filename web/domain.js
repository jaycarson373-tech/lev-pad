export const MAX_LEVERAGE = 10;
export function positiveDecimal(value, decimals = 9) {
  if (typeof value !== 'string' || !/^\d+(\.\d+)?$/.test(value)) return false;
  const [whole, fraction = ''] = value.split('.');
  return fraction.length <= decimals && BigInt(whole + fraction.padEnd(decimals, '0')) > 0n;
}
export function positionSize(value, leverage) {
  if (!positiveDecimal(value) || !Number.isInteger(leverage) || leverage < 1 || leverage > MAX_LEVERAGE) return null;
  const [whole, fraction = ''] = value.split('.');
  const base = BigInt(whole + fraction.padEnd(9, '0')) * BigInt(leverage);
  const result = (base / 1000000000n).toString() + '.' + (base % 1000000000n).toString().padStart(9, '0').replace(/0+$/, '');
  return result.replace(/\.$/, '');
}
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
export function routeFor(path) {
  if (path.startsWith('/list-token')) return 'launch';
  if (path.startsWith('/ecosystem')) return 'ecosystem';
  if (path.startsWith('/portfolio')) return 'account';
  return 'trade';
}
