const { handleWrappedCall } = require("../../../common/call");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

async function extractTreasuryCalls(call, indexer) {
  const spendCalls = [];
  await handleWrappedCall(call, null, indexer, [], innerCall => {
    const { section, method } = innerCall;
    if ("treasury" === section && "spend" === method) {
      spendCalls.push(innerCall);
    }
  });

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
