const dotenv = require("dotenv");
dotenv.config();
const isNil = require("lodash.isnil");

/**
 * This script save project related data(fund items and project itself) to database.
 */

const kusamaProjects = require("../../features/projects/data/kusama");
const polkadotProjects = require("../../features/projects/data/polkadot");
const {
  getProposalCollection,
  getTipCollection,
  getChildBountyCollection,
} = require("../../mongo/index");
const {
  getProjectFundCollection,
  getProjectCollection,
} = require("../../mongo-admin");
const BigNumber = require("bignumber.js");
const omit = require("lodash.omit");

const types = Object.freeze({
  proposal: "proposal",
  tip: "tip",
  bounty: "bounty",
  childBounty: "child-bounty",
});

function getChainName(token) {
  if (token === "dot") {
    return "polkadot";
  } else if (token === "ksm") {
    return "kusama";
  }

  throw new Error(`Unknown token ${token}`);
}

function getDecimals() {
  const chain = process.env.CHAIN;

  if (chain === "kusama") {
    return 12;
  } else if (chain === "polkadot") {
    return 10;
  }

  throw new Error(`Unknown chain ${chain}`);
}

function calcFiatValue(value, decimals, symbolPrice) {
  return new BigNumber(value)
    .dividedBy(Math.pow(10, decimals))
    .multipliedBy(symbolPrice)
    .toFixed(1);
}

async function saveOneProposal(proposal = {}, projectId) {
  const { proposalId, id, title, token } = proposal;
  const finalId = !isNil(proposalId) ? proposalId : id;
  const col = await getProposalCollection();
  const proposalInDb = await col.findOne({ proposalIndex: finalId });
  if (!proposalInDb) {
    throw new Error(`Can not find proposal in DB #${finalId}`);
  }

  const { symbolPrice = 0, value, indexer } = proposalInDb;
  const fiatValue = calcFiatValue(value, getDecimals(), symbolPrice);

  const fundCol = await getProjectFundCollection();
  const obj = {
    projectId,
    ...proposal,
    indexer,
    value,
    symbolPrice,
    fiatValue,
    title: title || proposalInDb.description,
  };
  await fundCol.findOneAndUpdate(
    { type: types.proposal, token, id: proposalId },
    { $set: obj },
    { upsert: true },
  );
}

async function saveOneTip(tip = {}, projectId) {
  const { tipId, token } = tip;
  const tipCol = await getTipCollection();
  const tipInDb = await tipCol.findOne({ hash: tipId });
  if (!tipInDb) {
    throw new Error(`Can not find tip in DB #${tipId}`);
  }

  const { symbolPrice = 0, medianValue, indexer } = tipInDb;
  const fiatValue = calcFiatValue(medianValue, getDecimals(), symbolPrice);
  const fundCol = await getProjectFundCollection();

  const obj = {
    projectId,
    ...tip,
    indexer,
    value: medianValue,
    symbolPrice,
    fiatValue,
    title: tip.reason || tipInDb.reason,
  };

  await fundCol.findOneAndUpdate(
    { type: types.tip, token, id: tipId },
    { $set: obj },
    { upsert: true },
  );
}

async function saveOneChildBounty(childBounty = {}, projectId) {
  const { id, token } = childBounty;

  const childBountyCol = await getChildBountyCollection();
  const childBountyInDb = await childBountyCol.findOne({ index: id });
  if (!childBountyInDb) {
    throw new Error(`Can not find child bounty in DB #${id}`);
  }

  const { symbolPrice = 0, value, indexer } = childBountyInDb;
  const fiatValue = calcFiatValue(value, getDecimals(), symbolPrice);
  const obj = {
    projectId,
    ...childBounty,
    indexer,
    value,
    symbolPrice,
    fiatValue,
    title: childBountyInDb.description,
  };

  const fundCol = await getProjectFundCollection();
  await fundCol.findOneAndUpdate(
    { type: types.childBounty, token, id },
    { $set: obj },
    { upsert: true },
  );
}

async function saveOneFund(fund = {}, projectId) {
  if (fund.type === types.tip) {
    await saveOneTip(fund, projectId);
  } else if (fund.type === types.childBounty) {
    await saveOneChildBounty(fund, projectId);
  } else {
    await saveOneProposal(fund, projectId);
  }
}

async function saveOneProjectFunds(funds = [], projectId) {
  for (const fund of funds) {
    await saveOneFund(fund, projectId);
  }
}

async function saveOneProject(project) {
  const fundCol = await getProjectFundCollection();
  const allFunds = await fundCol
    .find({ projectId: project.id })
    .sort({ "indexer.blockHeight": 1 })
    .toArray();
  if (allFunds.length <= 0) {
    throw new Error(`No funds found for project ${project.id}`);
  }

  const fiatValue = allFunds.reduce((result, { fiatValue = 0 }) => {
    return new BigNumber(result).plus(fiatValue).toNumber();
  }, 0);

  const latestTime = allFunds.reduce((result, fund) => {
    return Math.max(fund.indexer.blockTime, result);
  }, allFunds[0].indexer.blockTime);

  const ksmFunds = allFunds.filter((item) => item.token === "ksm");
  const dotFunds = allFunds.filter((item) => item.token === "dot");
  const kusamaCount = ksmFunds.length;
  const polkadotCount = dotFunds.length;
  const kusamaValue = ksmFunds.reduce((result, { value = 0 }) => {
    return new BigNumber(result).plus(value).toNumber();
  }, 0);
  const polkadotValue = dotFunds.reduce((result, { value = 0 }) => {
    return new BigNumber(result).plus(value).toNumber();
  }, 0);

  const fundsCount = {
    kusama: kusamaCount,
    polkadot: polkadotCount,
  };

  const startTime = allFunds[0].indexer.blockTime;
  const obj = {
    ...omit(project, ["proposals", "startTime"]),
    fiatValue,
    fundsCount,
    fundsValue: {
      kusama: kusamaValue,
      polkadot: polkadotValue,
    },
    startTime,
    latestTime,
  };

  const projectCol = await getProjectCollection();
  await projectCol.findOneAndUpdate(
    { id: project.id },
    { $set: obj },
    { upsert: true },
  );
}

async function clearData() {
  const projectCol = await getProjectCollection();
  await projectCol.deleteMany({});

  const fundCol = await getProjectFundCollection();
  await fundCol.deleteMany({});
}

(async () => {
  await clearData();

  const projects =
    process.env.CHAIN === "kusama" ? kusamaProjects : polkadotProjects;

  for (const project of projects) {
    const funds = (project.proposals || []).filter(
      ({ token }) => getChainName(token) === process.env.CHAIN,
    );
    await saveOneProjectFunds(funds, project.id);
    await saveOneProject(project);
    console.log(`project ${project.name} saved!`);
  }

  process.exit(0);
})();
