function pad(n, size) {
  let s = String(n);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}

function now() {
  return luxon.DateTime.fromJSDate(new Date());
}

function formatDate(luxonDate) {
  let weekday = luxonDate.weekdayLong;
  let date = luxonDate.toLocaleString(luxon.DateTime.DATE_FULL);
  return `${weekday} ${date}`;
}

function formatDateTime(luxonDate) {
  let time = luxonDate.toLocaleString(luxon.DateTime.TIME_24_SIMPLE);
  return `${formatDate(luxonDate)}, ${time}h`;
}

function formatTodayRaw() {
  let now = new Date();
  return `${pad(now.getMonth() + 1)}${pad(now.getDate())}${now.getFullYear()}`;
}

function asUrl(s, append, prov) {
  if (append) {
    s = `${s}-${append}`;
  }
  s = s.toLowerCase();
  if ((prov || provider) in ["animemovil", "gogoanime"]) {
    s = s.replace(/[;]/g, '');
  }
  s = s.replace(/[^-a-z0-9]+/g, '-').replace(/-{2,}/, '-');
  return encodeURIComponent(s);
}

function idify(s, prov) {
  return asUrl(s, null, prov || 'none');
}