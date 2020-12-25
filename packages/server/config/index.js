module.exports = require("production" === process.env.NODE_ENV
  ? "./config.prod.js"
  : "./config.dev.js");
