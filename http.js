function Options(fOpts) {
  this.apply = function(ajaxOpts) {
    fOpts(ajaxOpts);
  };
}

Options.prototype.and = function(opts) {
  let self = this;
  return opts ? new Options(ajaxOpts => {
    self.apply(ajaxOpts);
    opts.apply(ajaxOpts);
  }) : self;
}

function fetch(method, url, success, error, opts) {
  //console.log(`${method} ${url}`);
  let sendOpts = {
    url: url,
    type: method,
    cache: false,
    success: function(response, textStatus, xhr) {
      //console.log(`Success (${url})`);
      success(xhr.responseText, xhr.status, response);
    },
    error: function(xhr, textStatus, errorThrown) {
      if (error) {
        error(xhr.responseText, xhr.status);
      }
    }
  };
  if (opts) {
    opts.apply(sendOpts);
  }
  return $.ajax(sendOpts);
}

function get(url, success, error, opts) {
  return fetch('GET', url, success, error, opts);
}

function cors(method, url, success, error, opts) {
  return fetch(method, `https://cors-anywhere.herokuapp.com/${url}`, success, error, new Options(ajaxOpts => {
    addRequestHeader(ajaxOpts, "Access-Control-Allow-Origin", "*");
    ajaxOpts.crossDomain = true;
  }).and(opts));
}

function getCors(url, success, error, opts) {
  return cors('GET', url, success, error, opts);
}

var post, postCors;

(function() {
  function _post(base, url, data, success, error, opts) {
    return base('POST', url, success, error, new Options(ajaxOpts => {
      ajaxOpts.data = data;
    }).and(opts));
  }

  post = function(url, data, success, error, opts) {
    return _post(fetch, url, data, success, error, opts);
  }

  postCors = function(url, data, success, error, opts) {
    return _post(cors, url, data, success, error, opts);
  }
})();

function addRequestHeader(ajaxOpts, name, value) {
  let customBeforeSend = ajaxOpts.beforeSend;
  ajaxOpts.beforeSend = function(xhr) {
    if (customBeforeSend) {
      customBeforeSend(xhr);
    }
    xhr.setRequestHeader(name, value);
  };
}

function contentType(type) {
  return new Options(ajaxOpts => {
    addRequestHeader(ajaxOpts, "Content-Type", type);
  });
}

function auth(user, password) {
  return new Options(ajaxOpts => {
    addRequestHeader(ajaxOpts, "Authorization", "Basic " + btoa(user + ":" + password));
  });
}