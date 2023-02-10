module.exports = "production" === process.env.NODE_ENV
  ? require("./config.prod.js")
  : require("./config.dev.js");
