const Router = require("koa-router");
const projectsController = require("./project.controller");
const projectsV2Controller = require("./project.v2.controller");
const requireAuth = require("../../middleware/require-auth");
const maybeAuth = require("../../middleware/maybe-auth");

const router = new Router();
router.get("/projects", projectsController.getProjects);
router.get("/projects_v2", projectsV2Controller.getProjects);
router.get("/projects/:projectId", projectsController.getProject);

router.get(
  "/projects/:projectId/comments",
  maybeAuth,
  projectsController.getProjectComments
);
router.post(
  "/projects/:projectId/comments",
  requireAuth,
  projectsController.postProjectComment
);

router.get(
  "/projects/:projectId/rates",
  maybeAuth,
  projectsController.getRates,
);

router.get(
  "/projects/:projectId/ratestats",
  projectsController.getRateStats,
);

module.exports = router;
