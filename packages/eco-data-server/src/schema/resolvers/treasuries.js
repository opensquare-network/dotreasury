const { getStatusCol } = require("../../mongo");

async function treasuries(_, _args) {
  const { chain } = _args;
  const col = await getStatusCol();
  const q = {};
  if (chain) {
    Object.assign(q, { chain });
  }

  const treasuries = await col.find(q, { projection: { _id: 0 } }).toArray();
  return treasuries.map(treasury => {
    return {
      ...treasury,
      balanceUpdateAt: treasury.balanceUpdateAt.getTime(),
    }
  });
}

module.exports = {
  treasuries,
}
