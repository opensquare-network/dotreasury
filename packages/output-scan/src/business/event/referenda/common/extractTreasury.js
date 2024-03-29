const { handleWrappedCall } = require("../../../common/call");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

function checkArgNames(call, argNames = []) {
  const argsMeta = call.meta.args;
  if (argsMeta.length !== argNames.length) {
    return false;
  }

  for (let i = 0; i < argNames.length; i++) {
    if (argsMeta[i].name.toString() !== argNames[i]) {
      return false;
    }
  }

  return true;
}

function isSpendAmountCall(call = {}) {
  const { section, method } = call;
  if ("treasury" !== section || "spend" !== method) {
    return false;
  }

  return checkArgNames(call, ["amount", "beneficiary"]);
}

function isSpendLocal(call = {}) {
  const { section, method } = call;
  if ("treasury" !== section || "spendLocal" !== method) {
    return false;
  }

  return checkArgNames(call, ["amount", "beneficiary"]);
}

function isScheduleNamed(call = {}) {
  const { section, method } = call;
  return "scheduler" === section && "scheduleNamedAfter" === method;
}

async function extractSpendCalls(call, indexer) {
  const spendCalls = [];
  await handleWrappedCall(call, null, indexer, [], async innerCall => {
    if (isSpendAmountCall(innerCall) || isSpendLocal(innerCall)) {
      spendCalls.push(innerCall);
    } else if (isScheduleNamed(innerCall)) {
      const calls = await extractSpendCalls(innerCall.args[4], indexer);
      spendCalls.push(...calls);
    }
  });

  return spendCalls;
}

async function extractTreasuryCalls(call, indexer) {
  const spendCalls = await extractSpendCalls(call, indexer);
  if (spendCalls.length <= 0) {
    return {};
  }

  const amount = spendCalls.reduce((result, call) => {
    const amount = call.args[0].toString();
    return bigAdd(result, amount);
  }, 0);
  const beneficiary = spendCalls[0].args[1].toString();
  const beneficiaries = spendCalls.map(call => call.args[1].toString());

  return {
    calls: spendCalls,
    amount,
    beneficiary,
    beneficiaries,
  }
}

module.exports = {
  extractTreasuryCalls,
}
