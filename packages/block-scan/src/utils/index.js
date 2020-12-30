function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter(event => {
    const { phase } = event
    return !phase.isNull && phase.value.toNumber() === extrinsicIndex
  })
}

function isExtrinsicSuccess(events) {
  return events.some(e => e.event.method === 'ExtrinsicSuccess')
}

module.exports = {
  isExtrinsicSuccess,
  extractExtrinsicEvents,
}
