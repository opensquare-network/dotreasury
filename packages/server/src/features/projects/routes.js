const Router = require("koa-router");
const projectsController = require("./project.controller");
const requireAuth = require("../../middleware/require-auth");
const maybeAuth = require("../../middleware/maybe-auth");

const router = new Router();
router.get("/projects", projectsController.getProjects);
router.get("/projects/:projectName", projectsController.getProject);

router.get(
  "/projects/:projectName/comments",
  maybeAuth,
  projectsController.getProjectComments
);
router.post(
  "/projects/:projectName/comments",
  requireAuth,
  projectsController.postProjectComment
);

module.exports = router;
