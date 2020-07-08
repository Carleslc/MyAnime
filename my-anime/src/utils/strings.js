export function trim(s) {
  if (s === undefined || s === null) {
    return '';
  }
  return s.replace(/^\s+|\s+$/g, '');
}

export function isBlank(s) {
  return trim(s).length === 0;
}
