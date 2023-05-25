const QueryFieldsMap = {
  token: "dValue",
  fiat: "fiatValue",
};

const ProposalQueryFieldsMap = {
  ...QueryFieldsMap,
  index: "proposalIndex",
};

const BountyQueryFieldsMap = {
  ...QueryFieldsMap,
  index: "bountyIndex",
};

const ReferendaQueryFieldsMap = {
  ...QueryFieldsMap,
  index: "referendumIndex",
};

const TipQueryFieldsMap = QueryFieldsMap;

module.exports = {
  QueryFieldsMap,
  TipQueryFieldsMap,
  ProposalQueryFieldsMap,
  BountyQueryFieldsMap,
  ReferendaQueryFieldsMap,
};
