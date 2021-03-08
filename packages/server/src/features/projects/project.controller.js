const projects = require("./data");
const { extractPage } = require("../../utils");
const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");

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
      items: projects.slice(skip, skip + pageSize).map((item) => ({
        name: item.name,
        logo: item.logo,
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        proposals: item.proposals?.length,
        expense: item.proposals?.reduce(
          (previous, current) => previous + current.amount,
          0
        ),
        dollar: item.proposals?.reduce((previous, current) => (
          previous + (current.amount ?? 0) * (current.proposeTimePrice ?? 0)
        ), 0)
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

  // Comments API
  async getProjectComments(ctx) {
    const { page, pageSize } = extractPage(ctx);
    const projectName = ctx.params.projectName;

    const projectId = projects.filter((item) => item.name === projectName)[0]
      ?.id;
    if (!projectId) {
      throw new HttpError(404, "Project not found");
    }

    ctx.body = await commentService.getComments(
      {
        chain: "kusama",
        type: "project",
        index: projectId,
      },
      page,
      pageSize,
      ctx.request.user
    );
  }

  async postProjectComment(ctx) {
    const projectName = ctx.params.projectName;
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    const projectId = projects.filter((item) => item.name === projectName)[0]
      ?.id;
    if (!projectId) {
      throw new HttpError(404, "Project not found");
    }

    ctx.body = await commentService.postComment(
      {
        chain: "kusama",
        type: "project",
        index: projectId,
      },
      content,
      user
    );
  }
}

module.exports = new ProjectController();
