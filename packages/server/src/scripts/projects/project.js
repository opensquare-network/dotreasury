/**
 * This script save projects to database.
 */
const dotenv = require("dotenv");
dotenv.config();

const kusamaProjects = require("../../features/projects/data/kusama");
const polkadotProjects = require("../../features/projects/data/polkadot");
const { getProjectFundCollection, getProjectCollection } = require("../../mongo-admin");
const omit = require("lodash.omit");

async function saveOneProject(project) {
  const fundCol = await getProjectFundCollection();
  const allFunds = await fundCol.find({ projectId: project.id }).sort({ 'indexer.blockHeight': 1 }).toArray();
  if (allFunds.length <= 0) {
    throw new Error(`No funds found for project ${ project.id }`);
  }

  const kusamaCount = allFunds.filter(item => item.token === 'ksm').length;
  const polkadotCount = allFunds.filter(item => item.token === 'dot').length;

  const funds = {
    kusama: kusamaCount,
    polkadot: polkadotCount,
  }

  const startTime = allFunds[0].indexer.blockTime;
  const obj = {
    ...omit(project, ['proposals', 'startTime']),
    funds,
    startTime,
  }

  const projectCol = await getProjectCollection();
  await projectCol.findOneAndUpdate({ id: project.id }, { $set: obj }, { upsert: true });
}

;(async () => {
  const projectSet = new Set();
  const projects = [
    ...kusamaProjects,
    ...polkadotProjects,
  ];

  for (const project of projects) {
    if (projectSet.has(project.id)) {
      // it means this project has been handled.
      continue
    }

    await saveOneProject(project);
    projectSet.add(project.id);
    console.log(`project ${ project.name } saved!`)
  }

  process.exit(0);
})();
