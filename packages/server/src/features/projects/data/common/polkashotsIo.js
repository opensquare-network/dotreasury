const id = "PolkaShots";
const name = "PolkaShots.io";
const description = "A repository of Polkadot node database snapshots - regularly updated and fast to download from anywhere in the world.";
const logo = "polkashots-logo.svg";
const startTime = 1636422810000;

const relatedLinks = [
  {
    link: "https://polkashots.io/",
    description: "PolkaShots Website",
  },
];

const proposals = [
  {
    token: "dot",
    amount: 165.732,
    proposalId: 80,
    proposeTimePrice: 475.49,
    title: "Polkashots.io maintenance",
    achievements: [
      "A functioning infrastructure to provide usable blockchain database snapshots for the Kusama network, to the benefit of node operators and validators",
      "New snapshots at least once per day. Snapshots are filesystem dumps of the Kusama node storage backend files, of variety RocksDb, of type pruned, with a depth of 1000 blocks, compressed in 7z format, that can be used by validators to quickly spin up or restore their infrastructure",
      "A website frontend at polkashots.io with relevant metadata and download links, including a permanent link that always redirects to the most recent snapshot",
      "Best effort incident and problem management",
      "Redundant implementation setup which allows for continuity, seamless upgrades and basic disaster recovery & contingency management",
    ],
  },
  {
    token: "ksm",
    amount: 165.732,
    proposalId: 118,
    proposeTimePrice: 475.49,
    title: "Polkashots.io maintenance",
    achievements: [
      "A functioning infrastructure to provide usable blockchain database snapshots for the Kusama network, to the benefit of node operators and validators",
      "New snapshots at least once per day. Snapshots are filesystem dumps of the Kusama node storage backend files, of variety RocksDb, of type pruned, with a depth of 1000 blocks, compressed in 7z format, that can be used by validators to quickly spin up or restore their infrastructure",
      "A website frontend at polkashots.io with relevant metadata and download links, including a permanent link that always redirects to the most recent snapshot",
      "Best effort incident and problem management",
      "Redundant implementation setup which allows for continuity, seamless upgrades and basic disaster recovery & contingency management",
    ],
  },
];

module.exports = {
  id,
  logo,
  name,
  description,
  proposals,
  relatedLinks,
  startTime,
};
