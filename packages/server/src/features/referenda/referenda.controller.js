const {
  getReferendaReferendumCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

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

  const condition = {}
  if (status) {
    condition["state.name"] = status;
  }

  if (track) {
    condition["trackInfo.name"] = track;
  }

  return condition;
}

class ReferendaController {
  async getReferendaCount(ctx) {
    const { chain } = ctx.params;
    const referendumCol = await getReferendaReferendumCollection(chain);
    const totalQuery = await referendumCol.countDocuments({});
    ctx.body = totalQuery;
  }

  async getReferenda(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const condition = getCondition(ctx);
    const referendumCol = await getReferendaReferendumCollection(chain);
    const totalQuery = referendumCol.countDocuments(condition);
    const referendaQuery = referendumCol.aggregate([
      { $match: condition },
      {
        $addFields: {
          sort: {
            $switch: {
              branches: Object.keys(ReferendaStateSort).map(state => (
                {
                  case: {
                    $eq: ["$state.name", state]
                  },
                  then: ReferendaStateSort[state],
                }
              )),
              default: 0,
            }
          }
        }
      },
      {
        $sort: {
          sort: -1,
          "indexer.blockHeight": -1,
        }
      },
      { $skip: page * pageSize },
      { $limit: pageSize },
      {
        $project: {
          sort: 0,
          timeline: 0,
        }
      }
    ]).toArray();

    const [total, referenda] = await Promise.all([totalQuery, referendaQuery]);

    ctx.body = {
      items: referenda,
      page,
      pageSize,
      total,
    };
  }

  async getSummary(ctx) {
    const { chain } = ctx.params;
    const referendumCol = await getReferendaReferendumCollection(chain);
    const totalByStack = await referendumCol
      .aggregate([
        {
          $group: {
            _id: "$trackInfo.name",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();
    const activeByStack = await referendumCol
      .aggregate([
        {
          $match: {
            "state.name": {
              $in: [
                "Confirming",
                "Deciding",
                "Queueing",
                "Submitted",
              ]
            }
          }
        },
        {
          $group: {
            _id: "$trackInfo.name",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const result = {};
    for (const item of totalByStack) {
      result[item._id] = result[item._id] || { total: 0, active: 0 };
      result[item._id].total = item.count;
    }
    for (const item of activeByStack) {
      result[item._id] = result[item._id] || { total: 0, active: 0 };
      result[item._id].active = item.count;
    }

    ctx.body = result;
  }

}

module.exports = new ReferendaController();
