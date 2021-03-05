const Router = require("koa-router");
const projectsController = require("./project.controller");

const router = new Router();
router.get("/projects", projectsController.getProjects);
router.get("/projects/:projectName", projectsController.getProject);

module.exports = router;
