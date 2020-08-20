const fetch = require('request')

module.exports = function get(url, username, password) {
  return new Promise((resolve, reject) => {
    const options = { url }
    if (username && password) {
      options.auth = {
        user: username,
        password
      }
    }
    fetch(options, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        resolve(body)
      } else {
        reject(body || error, (res && res.statusCode) || 500)
      }
    })
  })
}
