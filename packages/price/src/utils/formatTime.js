const dayjs = require("dayjs");

function formatTime(timestamp) {
  return dayjs(parseInt(timestamp)).format("YYYY-MM-DD HH:mm:ss");
}

module.exports = {
  formatTime,
}
