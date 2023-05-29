const periodMap = {};

function setPeriodMark(height) {
  periodMap[height] = true;
}

function clearPeriodMark(height) {
  delete periodMap[height];
}

function hasPeriodMark(height) {
  return periodMap[height];
}

module.exports = {
  setPeriodMark,
  clearPeriodMark,
  hasPeriodMark,
}
