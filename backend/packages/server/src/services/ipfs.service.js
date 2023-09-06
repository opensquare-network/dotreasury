const Hash = require("ipfs-only-hash");
const { CID } = require("multiformats/cid");
const { getClients, ClientOptions, ClientMode } = require("@osn/ipfs");
const {
  INFURA_PROJECT_ID,
  INFURA_PROJECT_SECRET,
  LOCAL_IPFS_NODE_URL,
  USE_LOCAL_IFPS_NODE,
} = require("../env");

let ipfsClient = null;

async function initIpfsClient() {
  if (!ipfsClient) {
    [ipfsClient] = await getClients(
      USE_LOCAL_IFPS_NODE ? ClientMode.Local : ClientMode.Infura,
      new ClientOptions(
        INFURA_PROJECT_ID,
        INFURA_PROJECT_SECRET,
        LOCAL_IPFS_NODE_URL
      )
    );
  }
}

async function ipfsAdd(data) {
  await initIpfsClient();
  const added = await ipfsClient.add(JSON.stringify(data));
  return added;
}

async function ipfsAddBuffer(data) {
  await initIpfsClient();
  const added = await ipfsClient.add(data);
  return added;
}

async function cidOf(obj) {
  const data = JSON.stringify(obj);
  const cidV0 = await Hash.of(Buffer.from(data));
  const cid = CID.parse(cidV0);
  return cid.toV1().toString();
}

async function pinJsonToIpfsWithTimeout(data, timeout) {
  const errorMsg = "Pin json to ipfs timeout";
  return await Promise.race([
    new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), timeout)),
    ipfsAdd(data),
  ]);
}

module.exports = {
  cidOf,
  ipfsAdd,
  ipfsAddBuffer,
  pinJsonToIpfsWithTimeout,
};
