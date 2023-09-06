import BigNumber from "bignumber.js";

const ONE = new BigNumber(1);

export function getThresholdOfSimplyMajority() {
  return "50%";
}

export function getThresholdOfSuperMajorityAgainst(turnout, totalIssuance) {
  const sqrtElectorate = new BigNumber(totalIssuance).sqrt();
  const sqrtOfTurnout = new BigNumber(turnout).sqrt();

  if (sqrtOfTurnout.isZero() || sqrtElectorate.isZero()) {
    return "0%";
  }

  const bnAyes = ONE.times(sqrtOfTurnout).div(sqrtElectorate);
  const threshold = bnAyes.div(bnAyes.plus(ONE)).times(100).toFixed(0);

  return `${threshold}%`;
}

export function getThresholdOfSuperMajorityApprove(turnout, totalIssuance) {
  const sqrtElectorate = new BigNumber(totalIssuance).sqrt();
  const sqrtOfTurnout = new BigNumber(turnout).sqrt();

  if (sqrtOfTurnout.isZero() || sqrtElectorate.isZero()) {
    return "0%";
  }

  const bnAyes = ONE.times(sqrtElectorate).div(sqrtOfTurnout);
  const threshold = bnAyes.div(bnAyes.plus(ONE)).times(100).toFixed(0);

  return `${threshold}%`;
}
