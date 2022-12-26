const { queryReferendumInfo } = require("./query/referendumInfo");

async function handleSubmitted(event, indexer, extrinsic) {
  const referendumIndex = event.data[0].toNumber();
  const track = event.data[1].toNumber();
  const proposal = event.data[2].toJSON();
  // todo: 1. read and check track info, if not in treasury related track, ignore
  // todo: 2. check proposal, if not `treasury#spend`, ignore

  const onChainInfo = await queryReferendumInfo(referendumIndex, indexer.blockHash);
  if (!onChainInfo?.ongoing) {
    throw new Error(`No referendum info found at ${ indexer.blockHeight }`);
  }

  const info = onChainInfo.ongoing;
  // todo: 3. extract proposer, beneficiary, value info
}

module.exports = {
  handleSubmitted,
}
