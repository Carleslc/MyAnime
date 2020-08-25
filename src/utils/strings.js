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

export function pad(s, n = 2, padding = '0') {
  s = String(s);
  while (s.length < n) {
    s = padding + s;
  }
  return s;
}

export function generateToken(
  n = 32,
  chars = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
) {
  let result = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < n; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
