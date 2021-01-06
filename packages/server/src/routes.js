const featureRouters = [
  require("./features/tips/routes"),
  require("./features/proposals/routes"),
  require("./features/status/routes"),
];

module.exports = (app) => {
  for (const router of featureRouters) {
    app.use(router.routes()).use(router.allowedMethods({ throw: true }));
  }
};
