module.exports = {
  mongo: {
    ksmUrl: "mongodb://localhost:27017",
    ksmInputDbName: "dotreasury-input-ksm",
    ksmOutputDbName: "dotreasury-output-ksm",
    dotUrl: "mongodb://localhost:27017",
    dotInputDbName: "dotreasury-input-dot",
    dotOutputDbName: "dotreasury-output-dot",
    adminDbName: "dot-treasury-admin",
  },
  server: {
    port: 3213,
  },
};
