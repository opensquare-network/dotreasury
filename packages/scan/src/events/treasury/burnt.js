const { TreasuryEvent, Modules } = require("../../utils/constants");
const { saveNewBurnt } = require("../../store/burnt");

async function handleBurntEvent(event, eventIndexer) {
  const { section, method, data } = event;
  if (Modules.Treasury !== section || TreasuryEvent.Burnt !== method) {
    return;
  }

  const eventData = data.toJSON();
  const [balance] = eventData;

  await saveNewBurnt(balance, eventIndexer);
}

module.exports = {
  handleBurntEvent,
};
