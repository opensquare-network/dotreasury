const { memoryUsage } = require("process");

const getHeadUsedInGB = () => {
  return memoryUsage().heapUsed / 1024 / 1024 / 1024;
};

module.exports = {
  getHeadUsedInGB,
};
