const kusamaProjects = require("./data/kusama");
const polkadotProjects = require("./data/polkadot");
const { extractPage } = require("../../utils");
const commentService = require("../../services/comment.service");
const rateService = require("../../services/rate.service");
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
    project.dollar = sum(
      (project.proposals || []).map(
        (p) => (p.amount ?? 0) * (p.proposeTimePrice ?? 0)
      )
    );
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
          dollar: item.dollar,
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
    const { page, pageSize } = extractPage(ctx);
    const projectId = ctx.params.projectId;

    if (!projectId) {
      throw new HttpError(404, "Project not found");
    }

    ctx.body = await commentService.getComments(
      {
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

    if (!projectId) {
      throw new HttpError(404, "Project not found");
    }

    ctx.body = await commentService.postComment(
      {
        type: "project",
        index: projectId,
      },
      content,
      user
    );
  }

  async getRates(ctx) {
    const { projectId } = ctx.params;

    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    ctx.body = await rateService.getRates(
      {
        type: "project",
        index: projectId,
      },
      page,
      pageSize
    );
  }

  async getRateStats(ctx) {
    const { projectId } = ctx.params;

    ctx.body = await rateService.getRateStats({
      type: "project",
      index: projectId,
    });
  }
}

module.exports = new ProjectController();
