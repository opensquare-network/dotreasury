module.exports = {
  mongo: {
    ksmUrl: "mongodb://127.0.0.1:27017",
    ksmInputDbName: "dotreasury-input-ksm",
    ksmOutputDbName: "dotreasury-output-ksm",
    ksmCouncilDbName: "dotreasury-council-ksm",
    dotUrl: "mongodb://127.0.0.1:27017",
    dotInputDbName: "dotreasury-input-dot",
    dotOutputDbName: "dotreasury-output-dot",
    dotCouncilDbName: "dotreasury-council-dot",
    adminDbName: "dot-treasury-admin",
    priceDbName: "price",
  },
  server: {
    port: 3213,
  },
};
