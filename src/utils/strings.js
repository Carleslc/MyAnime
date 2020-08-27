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

export function nl2(s, tag) {
  return s
    .trim()
    .split('\n')
    .map((line) => `<${tag}>${line}</${tag}>`)
    .join('\n');
}

export function pad(s, n = 2, padding = '0') {
  s = String(s);
  while (s.length < n) {
    s = padding + s;
  }
  return s;
}
