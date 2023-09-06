const Router = require("koa-router");
const projectsController = require("./project.controller");
const projectsV2Controller = require("./project.v2.controller");

const router = new Router();
router.get("/projects", projectsController.getProjects);
router.get("/projects_v2", projectsV2Controller.getProjects);
router.get("/projects/:projectId", projectsController.getProject);
router.get("/projects_v2/:projectId", projectsV2Controller.getProject);

router.get(
  "/projects/:projectId/comments",
  projectsController.getProjectComments
);

router.get(
  "/projects/:projectId/rates",
  projectsController.getRates,
);

router.get(
  "/projects/:projectId/ratestats",
  projectsController.getRateStats,
);

module.exports = router;
