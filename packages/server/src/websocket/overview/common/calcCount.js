async function calcCount(
  proposals = [],
  tips = [],
  bounties = [],
  burntList = [],
  outputTransferList = [],
  referendaList = [],
) {
  const unFinishedProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) !== "Awarded" && (name || state) !== "Rejected"
  );
  const proposal = {
    unFinished: unFinishedProposals.length,
    all: proposals.length,
  };

  const unFinishedTips = tips.filter(
    ({ state: { state } }) => !["TipClosed", "TipRetracted", "TipSlashed"].includes(state)
  );
  const tip = {
    unFinished: unFinishedTips.length,
    all: tips.length,
  };

  const unFinishedBounties = bounties.filter(
    ({ state: { state: stateName } }) => {
      return !["Rejected", "Claimed", "Canceled"].includes(
        stateName
      );
    }
  );

  const bounty = {
    unFinished: unFinishedBounties.length,
    all: bounties.length,
  };

  const burnt = {
    all: burntList.length,
  };

  const transfer = {
    all: outputTransferList.length,
  };

  const unFinishedReferenda = referendaList.filter(
    ({ state: { name: stateName } }) => {
      return [
        "Confirming",
        "Deciding",
        "Queueing",
        "Submitted",
      ].includes(
        stateName
      );
    }
  );

  const referenda = {
    unFinished: unFinishedReferenda.length,
    all: referendaList.length,
  }

  return { proposal, tip, bounty, burnt, transfer, referenda };
}

module.exports = {
  calcCount,
};
