const { getStatusCol } = require("../../mongo");
const { omitChains } = require("../../consts/chains");
const { normalizeTreasury } = require("./common");

async function treasuries(_, _args) {
  const { chain } = _args;
  const col = await getStatusCol();
  const q = {};
  if (chain) {
    Object.assign(q, { chain });
  }

  const treasuries = await col.find(q, { projection: { _id: 0 } }).toArray();
  const filtered = treasuries.filter(
    (item) => !["polkadotAssetHub", ...omitChains].includes(item.chain),
  );

  return await Promise.all(
    filtered.map(async (treasury) => normalizeTreasury(treasury)),
  );
}

module.exports = {
  treasuries,
};
