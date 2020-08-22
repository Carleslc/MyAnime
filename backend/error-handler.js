module.exports = {
  http(res) {
    return (err, status) => {
      console.error(err);
      res.status(status || 500).send(err.message || '');
    };
  },
  httpConsole() {
    return (err, status) => console.error(`Error ${err}, status: ${status}`);
  },
  console() {
    return (err) => console.error(err.message);
  },
};
