const projects = require("./data");

class ProjectController {
  async getProjects(ctx) {
    ctx.body = {
      items: projects.map(item => ({
        name: item.name,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        proposals: item.proposals?.length,
        expense: item.proposals?.reduce((previous, current) => previous + current.amount, 0)
      }))
    };
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
