const { getProposalBeneficiaryCollection } = require("../../../mongo");
const { bigAdd } = require("../../../utils");
const { addUsdtValue } = require("./utils");

async function saveBeneficiaries(beneficiaries) {
  const proposalBeneficiaryCol = await getProposalBeneficiaryCollection();
  for (const item of beneficiaries) {
    await proposalBeneficiaryCol.updateOne(
      { beneficiary: item.beneficiary },
      { $set: item },
      { upsert: true },
    );
  }
}

function sortByValue(arr) {
  return arr.sort((a, b) => {
    return Number(b.fiatValue) - Number(a.fiatValue);
  });
}

function calcBestProposalBeneficiary(proposals = []) {
  const spentProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Awarded",
  );
  const map = {};
  for (const { beneficiary, value, symbolPrice } of spentProposals) {
    const perhaps = map[beneficiary];
    const proposalValue = perhaps ? bigAdd(perhaps.value, value) : value;
    const proposalFiatValue = addUsdtValue(
      perhaps ? perhaps.fiatValue : 0,
      value,
      symbolPrice || 0,
    );
    const count = perhaps ? perhaps.count + 1 : 1;

    map[beneficiary] = {
      value: proposalValue,
      fiatValue: proposalFiatValue,
      count,
    };
  }

  const beneficiaries = Object.entries(map).map(
    ([beneficiary, { value, fiatValue, count }]) => {
      return {
        beneficiary,
        value,
        fiatValue: fiatValue.toNumber(),
        count,
      };
    },
  );

  saveBeneficiaries(beneficiaries).catch(console.error);

  return sortByValue(beneficiaries).slice(0, 10);
}

module.exports = {
  calcBestProposalBeneficiary,
};
