const featureRouters = [
  require("./features/tips/routes"),
  require("./features/proposals/routes"),
  require("./features/bounties/routes"),
  require("./features/status/routes"),
  require("./features/burnt/routes"),
  require("./features/auth/routes"),
];

module.exports = (app) => {
  for (const router of featureRouters) {
    app.use(router.routes()).use(router.allowedMethods({ throw: true }));
  }
};
