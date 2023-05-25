const SortFieldsMap = {
  token: "dValue",
  fiat: "fiatValue",
};

const ProposalSortFieldsMap = {
  ...SortFieldsMap,
  index: "proposalIndex",
};

const BountySortFieldsMap = {
  ...SortFieldsMap,
  index: "bountyIndex",
};

const TipSortFieldsMap = SortFieldsMap;

module.exports = {
  TipSortFieldsMap,
  ProposalSortFieldsMap,
  BountySortFieldsMap,
};
