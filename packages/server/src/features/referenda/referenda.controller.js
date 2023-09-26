const BigNumber = require("bignumber.js");
const { HttpError } = require("../../exc");
const { getReferendaReferendumCollection } = require("../../mongo");
const { extractPage } = require("../../utils");
const { getRangeCondition } = require("../common/getRangeCondition");
const { ReferendaQueryFieldsMap } = require("../common/query");

const ReferendaStateSort = {
  Confirming: 10,
  Deciding: 9,
  Queueing: 8,
  Submitted: 7,
  Approved: 6,
  Executed: 5,
  Cancelled: 5,
  Killed: 5,
  TimedOut: 5,
  Rejected: 5,
};

function getCondition(ctx) {
  const { status, track } = ctx.request.query;

  const condition = {};
  if (status) {
    condition["state.name"] = status;
  }

  if (track) {
    condition["trackInfo.name"] = track;
  }

  const rangeCond = getRangeCondition(ctx);

  return { ...condition, ...rangeCond };
}

class ReferendaController {
  async getReferendaCount(ctx) {
    const referendumCol = await getReferendaReferendumCollection();
    const totalQuery = await referendumCol.countDocuments({});
    ctx.body = totalQuery;
  }

  async getReferenda(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const condition = getCondition(ctx);
    const referendumCol = await getReferendaReferendumCollection();
    const totalQuery = referendumCol.countDocuments(condition);

    let sortPipeline = [
      {
        $addFields: {
          sort: {
            $switch: {
              branches: Object.keys(ReferendaStateSort).map((state) => ({
                case: {
                  $eq: ["$state.name", state],
                },
                then: ReferendaStateSort[state],
              })),
              default: 0,
            },
          },
        },
      },
      {
        $sort: {
          sort: -1,
          "indexer.blockHeight": -1,
        },
      },
    ];

    const { sort } = ctx.request.query;
    if (sort) {
      let [fieldName, sortDirection] = sort.split("_");
      fieldName = ReferendaQueryFieldsMap[fieldName];
      if (!fieldName) {
        throw new HttpError(400, "Invalid sort field");
      }
      sortPipeline = [
        {
          $sort: {
            [fieldName]: sortDirection === "desc" ? -1 : 1,
            "indexer.blockHeight": -1,
          },
        },
      ];
    }

    const referendaQuery = referendumCol
      .aggregate([
        { $match: condition },
        ...sortPipeline,
        { $skip: page * pageSize },
        { $limit: pageSize },
        {
          $project: {
            sort: 0,
            timeline: 0,
          },
        },
      ])
      .toArray();

    const [total, referenda] = await Promise.all([totalQuery, referendaQuery]);

    ctx.body = {
      items: referenda,
      page,
      pageSize,
      total,
    };
  }

  async getSummary(ctx) {
    const referendumCol = await getReferendaReferendumCollection();
    const referendums = await referendumCol.find().toArray();
    const result = {};
    for (const referendum of referendums) {
      const { name } = referendum.trackInfo || {};
      const { name: state } = referendum.state || {};
      const { tally } = referendum.info || {};
      if (!name) {
        continue;
      }

      let {
        total = 0,
        voting = 0,
        passing = 0,
        approved = 0,
        rejected = 0,
      } = result[name] || {};

      total++;
      if (["Confirming", "Deciding", "Queueing", "Submitted"].includes(state)) {
        voting++;

        if (new BigNumber(tally?.ayes).gt(tally?.nays)) {
          passing++;
        }
      }
      if (["Approved", "Executed"].includes(state)) {
        approved++;
      }
      if ("Rejected" === state) {
        rejected++;
      }

      result[name] = {
        total,
        active: voting,
        voting,
        passing,
        approved,
        rejected,
      };
    }

    result.all = Object.values(result).reduce(
      (acc, cur) => ({
        total: acc.total + cur.total,
        active: acc.active + cur.active,
        voting: acc.voting + cur.voting,
        passing: acc.passing + cur.passing,
        approved: acc.approved + cur.approved,
        rejected: acc.rejected + cur.rejected,
      }),
      {
        total: 0,
        voting: 0,
        active: 0,
        passing: 0,
        approved: 0,
        rejected: 0,
      },
    );

    ctx.body = result;
  }
}

module.exports = new ReferendaController();
