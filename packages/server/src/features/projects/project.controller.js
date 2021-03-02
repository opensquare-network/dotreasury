const projects = require("./data");

class ProjectController {
  async getProjects(ctx) {
    ctx.body = projects;
  }

  async getProject(ctx) {
    const projectName = ctx.params.projectName;
    const project = projects.find(
      (p) =>
        (p.name || "").toLocaleLowerCase() === (projectName || "").toLowerCase()
    );
    if (!project) {
      ctx.status = 404;
      return;
    }

    ctx.body = project;
  }
}

module.exports = new ProjectController();
