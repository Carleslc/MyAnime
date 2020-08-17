export function trim(s) {
  if (s === undefined || s === null) {
    return '';
  }
  return s.replace(/^\s+|\s+$/g, '');
}

export function isBlank(s) {
  return trim(s).length === 0;
}

export function nl2br(s) {
  return s.trim().replace(/\r?\n/g, '<br /><br />');
}
