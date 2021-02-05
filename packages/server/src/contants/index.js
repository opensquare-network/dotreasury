const DefaultUserNotification = Object.freeze({
  participated: false,
  mentioned: true,
});

const SS58Format = Object.freeze({
  Polkadot: 0,
  Kusama: 2,
  Substrate: 42,
});

module.exports = {
  DefaultUserNotification,
  SS58Format,
};
