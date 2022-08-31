const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
const INFURA_PROJECT_SECRET = process.env.INFURA_PROJECT_SECRET || "";
const LOCAL_IPFS_NODE_URL =
  process.env.LOCAL_IPFS_NODE_URL || "http://ipfs.dotask.cc:5001";
const IPFS_ENDPOINT = process.env.IPFS_ENDPOINT || "https://ipfs.infura.io/ipfs/";
const USE_LOCAL_IFPS_NODE = ["true", "True", "TRUE", "1"].includes(process.env.USE_LOCAL_IFPS_NODE);

module.exports = {
  INFURA_PROJECT_ID,
  INFURA_PROJECT_SECRET,
  LOCAL_IPFS_NODE_URL,
  USE_LOCAL_IFPS_NODE,
  IPFS_ENDPOINT,
};
