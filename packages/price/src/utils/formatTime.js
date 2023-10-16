const dayjs = require("dayjs");

function formatTime(timestamp) {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
}

module.exports = {
  formatTime,
}
