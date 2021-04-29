const kusamaProjects = require("./data/kusama");
const polkadotProjects = require("./data/polkadot");
const { extractPage } = require("../../utils");
const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");

function sum(arr) {
  return arr.reduce((previous, current) => previous + current, 0);
}

function calc(projects) {
  projects.forEach((project) => {
    const ksmProposals =
      project.proposals?.filter((p) => p.token === "ksm") || [];
    const dotProposals =
      project.proposals?.filter((p) => p.token === "dot") || [];
    project.ksmProposalsCount = ksmProposals.length;
    project.dotProposalsCount = dotProposals.length;
    project.expenseKsm = sum(ksmProposals.map((p) => p.amount));
    project.expenseDot = sum(dotProposals.map((p) => p.amount));
  });
}

calc(kusamaProjects);
calc(polkadotProjects);

const projects = (chain) =>
  chain === "kusama"
    ? kusamaProjects
    : chain === "polkadot"
    ? polkadotProjects
    : null;

class ProjectController {
  async getProjects(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const total = projects(chain).length;
    const skip = page * pageSize;

    ctx.body = {
      items: projects(chain)
        .slice(skip, skip + pageSize)
        .map((item) => ({
          id: item.id,
          name: item.name,
          logo: item.logo,
          title: item.title,
          description: item.description,
          startTime: item.startTime,
          endTime: item.endTime,
          proposals: item.proposals?.length,
          ksmProposalsCount: item.ksmProposalsCount,
          dotProposalsCount: item.dotProposalsCount,
          expenseKsm: item.expenseKsm,
          expenseDot: item.expenseDot,
          expense: item.proposals?.reduce(
            (previous, current) => previous + current.amount,
            0
          ),
          dollar: item.proposals?.reduce(
            (previous, current) =>
              previous +
              (current.amount ?? 0) * (current.proposeTimePrice ?? 0),
            0
          ),
        })),
      page,
      pageSize,
      total,
    };
  }

  async getProject(ctx) {
    const { chain } = ctx.params;
    const projectId = ctx.params.projectId;
    const project = projects(chain).find(
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    const projectId = ctx.params.projectId;

    if (!projectId) {
      throw new HttpError(404, "Project not found");
    }

    ctx.body = await commentService.getComments(
      {
        chain,
        type: "project",
        index: projectId,
      },
      page,
      pageSize,
      ctx.request.user
    );
  }

  async postProjectComment(ctx) {
    const { chain } = ctx.params;
    const projectId = ctx.params.projectId;
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    if (!projectId) {
      throw new HttpError(404, "Project not found");
    }

    ctx.body = await commentService.postComment(
      {
        chain,
        type: "project",
        index: projectId,
      },
      content,
      user
    );
  }
}

module.exports = new ProjectController();
