module.exports = function idify(s) {
  s = s.toLowerCase();
  //s = s.replace(/[;]/g, '');
  s = s.replace(/[^-a-z0-9]+/g, '-').replace(/-{2,}/, '-');
  return encodeURIComponent(s);
}