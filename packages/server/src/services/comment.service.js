const { ObjectId } = require("mongodb");
const { getDiscussionCollection } = require("../mongo-admin");
const { HttpError } = require("../exc");

class CommentService {
  async getComments(indexer, validateBeforeCreate) {
    const discuCol = await getDiscussionCollection();

    let discussion = await discuCol
      .aggregate([
        { $match: { indexer } },
        { $unwind: "$comments" },
        {
          $lookup: {
            from: "user",
            localField: "comments.authorId",
            foreignField: "_id",
            as: "comments.author",
          },
        },
        {
          $addFields: {
            "comments.author": {
              $arrayElemAt: [
                {
                  $map: {
                    input: "$comments.author",
                    in: {
                      username: "$$this.username",
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            "comments.authorId": 0,
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
              indexer: "$indexer",
            },
            comments: {
              $push: "$comments",
            },
          },
        },
        {
          $project: {
            _id: "$_id._id",
            indexer: "$_id.indexer",
            comments: "$comments",
          },
        },
      ])
      .toArray();

    if (discussion[0]) {
      return discussion[0];
    }

    // If the discussion record is not created yet, then validate and create
    if (validateBeforeCreate) {
      await validateBeforeCreate();
    }

    const result = await discuCol.insertOne({
      indexer,
      comments: [],
    });

    if (!result.result.ok) {
      throw new HttpError(500, "Cannot initialize discussion.");
    }

    discussion = result.ops[0];
    return discussion;
  }

  async postComment(indexer, content, authorId) {
    const discuCol = await getDiscussionCollection();

    const now = new Date();
    const result = await discuCol.updateOne(
      { indexer },
      {
        $push: {
          comments: {
            commentId: new ObjectId(),
            authorId,
            content,
            createdAt: now,
            updatedAt: now,
          },
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Post comment error.");
    }

    if (result.result.nModified === 0) {
      return false;
    }

    return true;
  }

  async updateComment(indexer, commentId, newContent, authorId) {
    const discuCol = await getDiscussionCollection();

    const now = new Date();
    const result = await discuCol.updateOne(
      {
        indexer,
        comments: {
          $elemMatch: {
            commentId: ObjectId(commentId),
            authorId,
          },
        },
      },
      {
        $set: {
          "comments.$.content": newContent,
          "comments.$.updatedAt": now,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Update comment error.");
    }

    if (result.result.nModified === 0) {
      return false;
    }

    return true;
  }

  async deleteComment(indexer, commentId, authorId) {
    const discuCol = await getDiscussionCollection();
    let result = await discuCol.updateOne(
      { indexer },
      {
        $pull: {
          comments: {
            commentId: ObjectId(commentId),
            authorId,
          },
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Delete comment error.");
    }

    if (result.result.nModified === 0) {
      return false;
    }

    return true;
  }

  async unsetCommentReaction(indexer, commentId, userId) {
    const discuCol = await getDiscussionCollection();

    const result = await discuCol.updateOne(
      {
        indexer,
        "comments.commentId": ObjectId(commentId),
      },
      {
        $pull: {
          "comments.$.reactions": {
            userId,
          },
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, clean reaction.");
    }

    if (result.result.nModified === 0) {
      return false;
    }

    return true;
  }

  async setCommentReaction(indexer, commentId, reaction, userId) {
    const discuCol = await getDiscussionCollection();

    const now = new Date();
    let result = await discuCol.updateOne(
      {
        indexer,
        comments: {
          $elemMatch: {
            commentId: ObjectId(commentId),
            "reactions.userId": userId,
          },
        },
      },
      {
        $set: {
          "comments.$.reactions.$[reaction].reaction": reaction,
          "comments.$.reactions.$[reaction].updatedAt": now,
        },
      },
      {
        arrayFilters: [
          {
            "reaction.userId": userId,
          },
        ],
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, update reaction.");
    }

    if (result.result.nModified > 0) {
      return true;
    }

    result = await discuCol.updateOne(
      {
        indexer,
        comments: {
          $elemMatch: {
            commentId: ObjectId(commentId),
            authorId: { $ne: userId },
          },
        },
      },
      {
        $push: {
          "comments.$.reactions": {
            userId,
            reaction,
            createdAt: now,
            updatedAt: now,
          },
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, add reaction.");
    }

    if (result.result.nModified === 0) {
      return false;
    }

    return true;
  }
}

module.exports = new CommentService();
