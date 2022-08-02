async function handleStarted(event, indexer, blockEvents = []) {
  const eventData = event.data.toJSON();
  const [referendumIndex, threshold] = eventData;

}

module.exports = {
  handleStarted,
}
