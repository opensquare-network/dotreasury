const BigNumber = require("bignumber.js");
const dotenv = require("dotenv");
dotenv.config();

const minimist = require("minimist");

const {
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
  getBurntCollection,
  getIncomeInflationCollection,
  getElectionSlashCollection,
  getTreasurySlashCollection,
  getStakingSlashCollection,
  getDemocracySlashCollection,
} = require("../mongo");
const { bigAdd } = require("../utils");

const startDate = new Date("2021-01-01 00:00:00Z").getTime();
const endDate = new Date("2021-07-01 00:00:00Z").getTime();

// 对于 Proposal 和 Tip 状态的最后更新时间就是 Awarded 的时间
// 直接通过这个时间来判断 Proposal 和 Tip 是否在统计时间内
const firstHalfOfYearUpdated = {
  $and: [
    {"state.indexer.blockTime": {$gte: startDate}},
    {"state.indexer.blockTime": {$lt: endDate}},
  ]
};

// 对于 Income 条目，直接用事件发生的区块时间来过滤即可
const firstHalfOfYearCreated = {
  $and: [
    {"indexer.blockTime": {$gte: startDate}},
    {"indexer.blockTime": {$lt: endDate}},
  ]
};

function addUsdtValue(currUsdtValue, nextSymbolValue, symbolPrice, chain) {
  const nextUsdtValue = new BigNumber(nextSymbolValue)
    .div(Math.pow(10, chain === "kusama" ? 12 : 10))
    .multipliedBy(symbolPrice);
  return currUsdtValue ? nextUsdtValue.plus(currUsdtValue) : nextUsdtValue;
}

async function main() {
  const args = minimist(process.argv.slice(2));

  if (!args.chain) {
    console.log("Must specify chain with argument --chain=[polkadot|kusama]");
    return;
  }

  if (!["polkadot", "kusama"].includes(args.chain)) {
    console.log(`Unknown chain "${args.chain}"`);
    return;
  }

  const symbol = args.chain === "polkadot" ? "DOT" : "KSM";
  const decimals = args.chain === "polkadot" ? 10 : 12;
  const fromSymbolUnit = (value) => new BigNumber(value).dividedBy(Math.pow(10, decimals)).toString();

  console.log(`========== Output ==========`);

  const tipCol = await getTipCollection(args.chain);
  const proposalCol = await getProposalCollection(args.chain);
  const bountyCol = await getBountyCollection(args.chain);
  const burntCol = await getBurntCollection(args.chain);

  // 计算半年内创建的 Tip
  const tipCount = await tipCol.countDocuments(firstHalfOfYearCreated);
  const awardedTipCount = await tipCol.countDocuments({
    ...firstHalfOfYearCreated,
    "state.state": "TipClosed",
    "state.data.2": { $gt: 0 },
  });
  console.log("Tip count =", tipCount, ` (${awardedTipCount} Awarded)`)

  // 计算半年内创建的 Proposal
  const proposalCount = await proposalCol.countDocuments(firstHalfOfYearCreated);
  const approvedProposalCount = await proposalCol.countDocuments({
    ...firstHalfOfYearCreated,
    "state.state": { $in: ["Awarded", "Approved"] },
  });
  console.log("Proposal count =", proposalCount, ` (${approvedProposalCount} Approved)`)

  // 计算半年内创建的 Bounty
  const bountyCount = await bountyCol.countDocuments(firstHalfOfYearCreated);
  const activedBountyCount = await bountyCol.countDocuments({
    ...firstHalfOfYearCreated,
    "timeline.name": "BountyBecameActive"
  });
  console.log("Bounty count =", bountyCount, ` (${activedBountyCount} Actived)`)

  ////////// 计算 Proposal 的统计数值 //////////

  // 半年之前的旧 Proposal （最后状态更新时间是半年前，表示 Awarded 时间是在半年前）
  const oldProposals = await proposalCol.find({ "indexer.blockTime": { $lt: startDate } }).toArray();

  // 半年前 旧的 Proposal beneficiary 保存起来 （已经 Awarded 的才计算在内）
  const oldProposalBeneficiaries = new Set([]);
  for (const { state: { state }, beneficiary } of oldProposals) {
    if ((state === "Awarded" || state === "Approved") && beneficiary) {
      oldProposalBeneficiaries.add(beneficiary);
    }
  }

  // 找出半年内的 Awarded 的 Proposal (Approved 的也算)
  const proposals = await proposalCol.find(firstHalfOfYearCreated).toArray();
  const spentProposals = proposals.filter(
    ({ state: { state } }) => state === "Awarded" || state === "Approved"
  );

  // 累计 这些Proposal的Ouput
  const proposalSpentUnit = spentProposals.reduce(
    (result, { value }) => bigAdd(result, value),
    0
  );
  const proposalSpent = fromSymbolUnit(proposalSpentUnit);

  // 估算 这些Proposal的Output USDT价值
  // 使用每个 Proposal 预先保存的USDT价格来计算
  let proposalSpentUsdt = 0;
  for (const { proposalIndex, value, symbolPrice } of spentProposals) {
    if (!symbolPrice) {
      console.log(`Warning: symbol price not found #${proposalIndex}`);
    }

    proposalSpentUsdt = addUsdtValue(
      proposalSpentUsdt,
      value,
      symbolPrice || 0,
      args.chain
    );
  }

  // 这半年的 beneficiary 有多少是之前 Proposal 没有的？
  // 计算出数量
  const newProposalBeneficiries = new Set(spentProposals.reduce(
    (result, { beneficiary }) => (beneficiary && !oldProposalBeneficiaries.has(beneficiary)) ? [...result, beneficiary] : result,
    []
  ));

  //////////////// Tip 相关统计 //////////////

  // 半年之前的旧 Tip （最后状态更新时间是半年前，表示 Awarded 时间是在半年前）
  const oldTips = await tipCol.find({ "indexer.blockTime": { $lt: startDate } }).toArray();

  // 半年前 旧的 Tip beneficiary 和 Tip finder 保存起来 （已经 Awarded 的才计算在内）
  const oldTipBeneficiaries = new Set([]);
  const oldTipFinders = new Set([]);
  for (const { state, meta } of oldTips) {
    if (state.state !== "TipClosed") {
      continue;
    }
    if ((state.data?.[2] || 0) === 0) {
      continue;
    }
    if (meta.finder) {
      oldTipFinders.add(meta.finder);
    }
    if (meta.who) {
      oldTipBeneficiaries.add(meta.who);
    }
  }

  // 找出半年内的 Awarded 的 Tip
  const tips = await tipCol.find(firstHalfOfYearCreated).toArray();
  const spentTips = tips.filter(({ state }) => state.state === "TipClosed" && (state.data?.[2] || 0) > 0);

  // 累计 这些Tip的Ouput
  const tipSpentUnit = spentTips.reduce((result, { meta, state, medianValue }) => {
    const eventValue = state.data[2];
    const value = eventValue || 0;
    return bigAdd(result, value);
  }, 0);
  const tipSpent = fromSymbolUnit(tipSpentUnit);

  // 对应的 USDT 也计算出来
  let tipSpentUsdt = 0;
  for (const { hash, state, medianValue, symbolPrice } of spentTips) {
    if (!symbolPrice) {
      console.log(`Warning: symbol price not found #${hash}`);
    }

    const eventValue = state.data[2];
    const value = eventValue || 0;
    tipSpentUsdt = addUsdtValue(
      tipSpentUsdt,
      value,
      symbolPrice || 0,
      args.chain
    );
  }

  // 这半年新出现的 beneficiary 有多少？
  const newTipBeneficiaries = new Set(spentTips.reduce(
    (result, { meta }) => (meta.who && !oldTipBeneficiaries.has(meta.who)) ? [...result, meta.who] : result,
    []
  ));

  // 这半年新出现的 finder 有多少？
  const newTipFinders = new Set(spentTips.reduce(
    (result, { meta }) => (meta.finder && !oldTipFinders.has(meta.finder)) ? [...result, meta.finder] : result,
    []
  ));

  //////////////// Bounty 相关统计 //////////////

  // 半年之前的旧 Bounty，出现过的 beneficiary 保存起来
  // 根据 timeline BountyAwarded 的时间来过滤
  const oldBountyBeneficiaries = new Set([]);
  const bountyBeneficiaries = new Set([]);

  const bounties = await bountyCol.find({}).toArray();
  const spentBounties = [];
  for (const bounty of bounties) {
    const { timeline } = bounty;
    const createTime = bounty.indexer.blockTime;

    const activedItem = timeline.filter(item => item.name === "BountyBecameActive")[0];
    if (activedItem) {
      if (startDate <= createTime && createTime < endDate) {
        spentBounties.push(bounty);
      }
    }

    const awardedItem = timeline.filter(item => item.name === "BountyAwarded")[0];
    if (awardedItem) {
      const beneficiary = awardedItem.eventData[1];

      // Created 的时间发生在半年前，保存到 旧beneficiary 集合里
      if (createTime < startDate) {
        oldBountyBeneficiaries.add(beneficiary);
      }

      // Created 的时间在上半年，保存 beneficiary 保存起来
      // 这些 Bounty 条目也记录起来，下面统计使用
      if (startDate <= createTime && createTime < endDate) {
        bountyBeneficiaries.add(beneficiary);
      }
    }
  }

  // 计算 Bounty 的支出
  const bountySpentUnit = spentBounties.reduce(
    (result, { meta: { value } }) =>  bigAdd(result, value),
    0
  );
  const bountySpent = fromSymbolUnit(bountySpentUnit);

  // 计算对应的 USDT
  let bountySpentUsdt = 0;
  for (const {bountyIndex, meta: { value }, symbolPrice } of spentBounties) {
    if (!symbolPrice) {
      console.log(`Warning: symbol price not found #${bountyIndex}`);
    }

    bountySpentUsdt = addUsdtValue(
      bountySpentUsdt,
      value,
      symbolPrice || 0,
      args.chain
    );
  }

  // 这半年Awarded 的 beneficary 有那些是之前没Awarded 过的，计算数量
  const newBountyBeneficiaries = Array.from(bountyBeneficiaries).reduce(
    (result, item) => result +(oldBountyBeneficiaries.has(item) ? 0 : 1),
    0
  );

  // Output total spent
  const totalSpent = new BigNumber(proposalSpent).plus(tipSpent).plus(bountySpent).toString();
  const totalSpentUSDT = new BigNumber(proposalSpentUsdt).plus(tipSpentUsdt).plus(bountySpentUsdt).toString();

  console.log("Total spent =", totalSpent, symbol, ` (${totalSpentUSDT} USDT)`);
  console.log("  Proposal spent =", proposalSpent, symbol, ` (${proposalSpentUsdt} USDT)`);
  console.log("  Tip spent =", tipSpent, symbol, ` (${tipSpentUsdt} USDT)`);
  console.log("  Bounty spent =", bountySpent, symbol, ` (${bountySpentUsdt} USDT)`);

  console.log("New beneficiaries")
  console.log("  proposal =", newProposalBeneficiries.size);
  console.log("  tip =", newTipBeneficiaries.size);
  console.log("  bounty =", newBountyBeneficiaries);
  console.log("New tip finder =", newTipFinders.size);

  console.log("New proposal beneficiaries", newProposalBeneficiries)

  // Output burnt amount
  const burntList = await burntCol.find(firstHalfOfYearCreated).toArray();
  const burntAmountUnit = burntList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);
  const burntAmount = fromSymbolUnit(burntAmountUnit);
  console.log("Burnt amount =", burntAmount, symbol);

  // Income
  console.log(`\n========== Income ==========`);

  const inflationCol = await getIncomeInflationCollection(args.chain);
  const electionSlashCol = await getElectionSlashCollection(args.chain);
  const stakingSlashCol = await getStakingSlashCollection(args.chain);
  const treasurySlashCol = await getTreasurySlashCollection(args.chain);
  const democracySlashCol = await getDemocracySlashCollection(args.chain);

  ////////////////// Income 统计 //////////////////

  // 所有Income 类型都直接根据事件发生的区块时间来过滤

  // Inflation
  const inflations = await inflationCol.find(firstHalfOfYearCreated).toArray();
  const inflationsIncomeUnit = inflations.reduce(
    (result, { balance }) => bigAdd(result, balance),
    0
  );
  const inflationsIncome = fromSymbolUnit(inflationsIncomeUnit);
  console.log("Inflation =", inflationsIncome, symbol);

  // Staking slash
  const stakingSlashs = await stakingSlashCol.find(firstHalfOfYearCreated).toArray();
  const stakingSlashIncomeUnit = stakingSlashs.reduce(
    (result, { balance }) => bigAdd(result, balance),
    0
  );
  const stakingSlashIncome = fromSymbolUnit(stakingSlashIncomeUnit);

  // Election slash
  const electionSlashs = await electionSlashCol.find(firstHalfOfYearCreated).toArray();
  const electionSlashIncomeUnit = electionSlashs.reduce(
    (result, { balance }) => bigAdd(result, balance),
    0
  );
  const electionSlashIncome = fromSymbolUnit(electionSlashIncomeUnit);

  // Treasury slash
  const treasurySlashs = await treasurySlashCol.find(firstHalfOfYearCreated).toArray();
  const treasurySlashIncomeUnit = treasurySlashs.reduce(
    (result, { balance }) => bigAdd(result, balance),
    0
  );
  const treasurySlashIncome = fromSymbolUnit(treasurySlashIncomeUnit);

  // Democracy slash
  const democracySlashs = await democracySlashCol.find(firstHalfOfYearCreated).toArray();
  const democracySlashIncomeUnit = democracySlashs.reduce(
    (result, { balance }) => bigAdd(result, balance),
    0
  );
  const democracySlashIncome = fromSymbolUnit(democracySlashIncomeUnit);

  const totalSlashIncome = new BigNumber(democracySlashIncome).plus(treasurySlashIncome).plus(electionSlashIncome).plus(stakingSlashIncome).toString();
  console.log("Total slash =", totalSlashIncome, symbol);
  console.log("  Democracy slash =", democracySlashIncome, symbol);
  console.log("  Treasury slash =", treasurySlashIncome, symbol);
  console.log("  Election slash =", electionSlashIncome, symbol);
  console.log("  Staking slash =", stakingSlashIncome, symbol);

  process.exit();
}

main();
