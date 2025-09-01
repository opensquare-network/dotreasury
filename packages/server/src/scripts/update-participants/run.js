const { updateParticipants } = require(".");

updateParticipants()
  .catch(console.error)
  .finally(() => process.exit(0));
