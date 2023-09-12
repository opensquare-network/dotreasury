const { ObjectId } = require("mongodb");
const { getCommentCollection, getUserCollection } = require("../mongo-admin");
const { md5 } = require("../utils");

class CommentService {
  async getComments(indexer, page, pageSize) {
    const commentCol = await getCommentCollection();
    const total = await commentCol.countDocuments({ indexer });

    if (page === "last") {
      const totalPages = Math.ceil(total / pageSize);
      page = Math.max(0, totalPages - 1);
    }

    const comments = await commentCol
      .aggregate([
        { $match: { indexer } },
        { $sort: { createdAt: 1 } },
        { $skip: page * pageSize },
        { $limit: pageSize },
        {
          $lookup: {
            from: "reaction",
            let: { commentId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$commentId", "$$commentId"],
                  },
                },
              },
              {
                $group: {
                  _id: "$reaction",
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  reaction: "$_id",
                  count: 1,
                },
              },
            ],
            as: "reactions",
          },
        },
      ])
      .toArray();

    if (comments.length > 0) {
      const userIds = new Set();
      comments.forEach((comment) => {
        userIds.add(comment.authorId.toString());
      });

      const userCol = await getUserCollection();
      const users = await userCol
        .find({
          _id: {
            $in: Array.from(userIds).map(ObjectId),
          },
        })
        .toArray();

      const userMap = {};
      users.forEach((user) => {
        const emailHash = md5(user.email.trim().toLocaleLowerCase());

        userMap[user._id.toString()] = {
          username: user.username,
          avatar: `https://www.gravatar.com/avatar/${emailHash}?d=https://www.dotreasury.com/imgs/avatar.png`,
          address: user[`${chain}Address`],
          addresses: ["kusama", "polkadot"].reduce((addresses, chain) => {
            const address = user[`${chain}Address`];
            if (address) {
              return [
                ...addresses,
                {
                  chain,
                  address,
                },
              ];
            }
            return addresses;
          }, []),
        };
      });

      comments.forEach((comment) => {
        comment.author = userMap[comment.authorId.toString()];
        delete comment.authorId;
      });
    }

    return {
      items: comments,
      page,
      pageSize,
      total,
    };
  }

  async hasComment(author) {
    const commentCol = await getCommentCollection();
    const existing = await commentCol.findOne({ authorId: author._id });
    return !!existing;
  }
}

module.exports = new CommentService();
