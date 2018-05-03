module.exports = function idify(s, prov) {
  if (append) {
    s = `${s}-${append}`;
  }
  s = s.toLowerCase();
  //s = s.replace(/[;]/g, '');
  s = s.replace(/[^-a-z0-9]+/g, '-').replace(/-{2,}/, '-');
  return encodeURIComponent(s);
}