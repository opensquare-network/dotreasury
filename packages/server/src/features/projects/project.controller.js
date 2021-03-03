const projects = require("./data");
const { extractPage } = require("../../utils");

class ProjectController {
  async getProjects(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const total = projects.length;
    const skip = page * pageSize;

    ctx.body = {
      items: projects.slice(skip, skip + pageSize).map(item => ({
        name: item.name,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        proposals: item.proposals?.length,
        expense: item.proposals?.reduce((previous, current) => previous + current.amount, 0)
      })),
      page,
      pageSize,
      total,
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
