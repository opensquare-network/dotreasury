const Router = require("koa-router");

const router = new Router();

const chainFeatureRouters = [
  require("./features/status/routes"),
  require("./features/referenda/routes"),
  require("./features/tips/routes"),
  require("./features/proposals/routes"),
  require("./features/bounties/routes"),
  require("./features/burnt/routes"),
  require("./features/income/routes"),
  require("./features/stats/routes"),
  require("./features/projects/routes"),
  require("./features/outputtransfers/routes"),
  require("./features/child-bounties/routes"),
  require("./features/profile/routes"),
  require("./features/participant/routes"),
  require("./features/overview/routes"),
  require("./features/period/routes"),
  require("./features/centrifuge/routes"),
];

const commonFeatureRouters = [
  require("./features/rate/routes"),
  require("./features/scan/routes"),
];

module.exports = (app) => {
  for (const r of commonFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }
  for (const r of chainFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }
  app.use(router.routes());
};
