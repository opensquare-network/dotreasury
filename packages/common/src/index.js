const apiObj = require("./chain/api");
const meta = require("./mongo/meta");
const blockApi = require("./chain/blockApi");

module.exports = {
  ...apiObj,
  meta,
  ...blockApi,
}
