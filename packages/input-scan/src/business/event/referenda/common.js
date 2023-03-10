function isTreasuryDeposit(section, method) {
  return "treasury" === section && "Deposit" === method;
}

function isReferendaSlashed(section, method, pallet = "referenda") {
  return pallet === section && "DepositSlashed" === method;
}

function findKilledReferendumIndex(sort, blockEvents, pallet = "referenda") {
  let index = sort - 1;

  while (index >= 0) {
    const { event: { section, method, data } } = blockEvents[index]
    if (section === pallet && method === "Killed") {
      return data[0].toNumber();
    }

    if (!isTreasuryDeposit(section, method) || !isReferendaSlashed(section, method, pallet)) {
      return
    }
  }

  return null;
}


module.exports = {
  findKilledReferendumIndex,
}
