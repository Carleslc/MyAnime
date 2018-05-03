module.exports = {
  http: function(res) {
    return (err, status) => {
      console.error(err)
      res.status(status || 500).send(err.message || '')
    }
  },
  http2: function(res) {
    return err => {
      console.error(err)
      res.status(err.statusCode || 500).send(err.statusMessage || '')
    }
  },
  httpConsole: function() {
    return (err, status) => console.error(`Error ${err}, status: ${status}`);
  },
  console: function() {
    return (err) => console.error(err)
  }
}