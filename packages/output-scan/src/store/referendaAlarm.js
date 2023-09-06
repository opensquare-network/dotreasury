const alarmMap = {};

function addReferendaAlarmAt(blockHeight, referendumIndex) {
  const ids = alarmMap[blockHeight] || [];
  alarmMap[blockHeight] = [...new Set([...ids, referendumIndex])];
}

function getAlarmedReferenda(blockHeight) {
  return alarmMap[blockHeight] || [];
}

function clearReferendaAlarmAt(blockHeight) {
  delete alarmMap[blockHeight];
}

module.exports = {
  addReferendaAlarmAt,
  getAlarmedReferenda,
  clearReferendaAlarmAt,
}
