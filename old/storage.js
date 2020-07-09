var storage;

(function() {
  function LocalStorage() {
    this.get = function(tag) {
      return localStorage.getItem(tag);
    };
    this.with = function(tag, callback) {
      let value = this.get(tag);
      if (value !== null) {
        callback(value);
      }
    };
    this.set = function(tag, value) {
      localStorage.setItem(tag, value);
    };
    this.remove = function(tag) {
      localStorage.removeItem(tag);
    };
  }

  function MemStorage() {
    this.mem = {};
    this.get = function(tag) {
      var value = this.mem[tag];
      return value !== undefined ? value : null;
    };
    this.with = function(tag, callback) {
      let value = this.get(tag);
      if (value !== null) {
        callback(value);
      }
    };
    this.set = function(tag, value) {
      this.mem[tag] = value;
    };
    this.remove = function(tag) {
      this.mem[tag] = undefined;
    };
  }

  storage = typeof(Storage) !== "undefined" ? new LocalStorage() : new MemStorage();
})();