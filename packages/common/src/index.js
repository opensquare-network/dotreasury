const apiObj = require("./chain/api");
const meta = require("./mongo/meta");
const blockApi = require("./chain/blockApi");
const log = require("./logger");
const env = require("./env");
const chainHeight = require("./chain/latestHead");
const specs = require("./chain/specs");
const { fetchBlocks } = require("./chain/fetchBlocks");

module.exports = {
  ...apiObj,
  meta,
  ...blockApi,
  ...log,
  env,
  chainHeight,
  specs,
  fetchBlocks,
}
