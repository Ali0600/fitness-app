import moment from 'moment';

const MS_PER_HOUR = 3600 * 1000;

export function hoursSince(isoString) {
  if (!isoString) return Infinity;
  const t = new Date(isoString).getTime();
  if (Number.isNaN(t)) return Infinity;
  return (Date.now() - t) / MS_PER_HOUR;
}

export function relativeFromNow(isoString) {
  if (!isoString) return 'never';
  return moment(isoString).fromNow();
}

export function formatHours(h) {
  if (!Number.isFinite(h)) return '—';
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48) return `${h.toFixed(1)}h`;
  return `${Math.floor(h / 24)}d ${Math.round(h % 24)}h`;
}

export function isRested(isoString, recommendedRestHours) {
  return hoursSince(isoString) >= recommendedRestHours;
}

export function restStatusColor(isoString, recommendedRestHours) {
  return isRested(isoString, recommendedRestHours) ? '#2ecc71' : '#e74c3c';
}
