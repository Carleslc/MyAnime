const fetch = require('request')

module.exports = function get(url, username, password) {
  return new Promise(function(resolve, reject) {
    var options = { url: url }
    if (username && password) {
      options.auth = {
        user: username,
        password: password
      }
    }
    fetch(options, function(error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body)
      } else {
        reject(body || error, (res && res.statusCode) || 500)
      }
    })
  })
}