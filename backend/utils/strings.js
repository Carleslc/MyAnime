module.exports = {
  generateToken(n = 32, chars = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
    let result = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < n; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  },
};
