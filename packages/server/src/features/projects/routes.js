const Router = require("koa-router");
const projectsController = require("./project.controller");
const requireAuth = require("../../middleware/require-auth");
const maybeAuth = require("../../middleware/maybe-auth");

const router = new Router();
router.get("/projects", projectsController.getProjects);
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

module.exports = router;
