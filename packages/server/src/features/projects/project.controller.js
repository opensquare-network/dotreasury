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
        id: item.id,
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
    const projectId = ctx.params.projectId;
    const project = projects.find(
      (p) =>
        (p.id || "").toLocaleLowerCase() === (projectId || "").toLowerCase()
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
    const projectId = ctx.params.projectId;

    // const projectId = projects.filter((item) => item.name === projectName)[0]
    //   ?.id;
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
    const projectId = ctx.params.projectId;
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    // const projectId = projects.filter((item) => item.name === projectName)[0]
    //   ?.id;
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
