const { ObjectId } = require("mongodb");
const mailService = require("./mail.service");
const {
  getDiscussionCollection,
  getUserCollection,
} = require("../mongo-admin");
const { HttpError } = require("../exc");

class CommentService {
  async getComments(indexer, validateBeforeCreate) {
    const discuCol = await getDiscussionCollection();
    let discussion = await discuCol.findOne({ indexer });

    if (discussion) {
      const userIds = new Set();
      discussion.comments?.forEach((comment) => {
        userIds.add(comment.authorId.toString());
        comment.reactions?.forEach((reaction) => {
          userIds.add(reaction.userId.toString());
        });
      });

      const userCol = await getUserCollection();
      const users = await userCol
        .find(
          { _id: { $in: Array.from(userIds).map(ObjectId) } },
          { projection: { username: 1 } }
        )
        .toArray();
      const userMap = {};
      users.forEach((user) => {
        userMap[user._id.toString()] = user;
      });

      discussion.comments?.forEach((comment) => {
        comment.author = userMap[comment.authorId.toString()];
        delete comment.authorId;
        comment.reactions?.forEach((reaction) => {
          reaction.user = userMap[reaction.userId.toString()];
          delete reaction.userId;
        });
      });

      users.forEach((user) => {
        delete user._id;
      });
    } else {
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
    }

    return discussion;
  }

  async postComment(indexer, content, author) {
    const discuCol = await getDiscussionCollection();

    const commentId = new ObjectId();
    const now = new Date();
    const result = await discuCol.updateOne(
      { indexer },
      {
        $push: {
          comments: {
            commentId,
            authorId: author._id,
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

    // Send notification email to mentioned users
    this.processMetions(indexer, commentId, content, author);

    return true;
  }

  async processMetions(indexer, commentId, content, author) {
    const metions = new Set();
    const reMetion = /\[@(\w+)\]\(https:\/\/dotreasury.com\/user\/(\w+)\)/g;
    let match;
    while ((match = reMetion.exec(content)) !== null) {
      const [, u1, u2] = match;
      if (u1 === u2) {
        metions.add(u1);
      }
    }

    if (metions.size === 0) {
      return;
    }

    const userCol = await getUserCollection();
    const users = await userCol
      .find(
        {
          username: {
            $in: Array.from(metions),
          },
        },
        {
          projection: {
            username: 1,
            email: 1,
            notification: 1,
            emailVerified: 1,
          },
        }
      )
      .toArray();

    for (const user of users) {
      if (user.emailVerified && (user.notification?.mentioned ?? true)) {
        mailService.sendCommentMetionEmail({
          email: user.email,
          author: author.username,
          mentioned: user.username,
          content,
          indexer,
          commentId,
        });
      }
    }
  }

  async updateComment(commentId, newContent, author) {
    const discuCol = await getDiscussionCollection();

    const now = new Date();
    const result = await discuCol.findOneAndUpdate(
      {
        comments: {
          $elemMatch: {
            commentId: ObjectId(commentId),
            authorId: author._id,
          },
        },
      },
      {
        $set: {
          "comments.$.content": newContent,
          "comments.$.updatedAt": now,
        },
      },
      {
        projection: {
          indexer: 1,
        },
      }
    );

    if (!result.ok) {
      throw new HttpError(500, "Update comment error.");
    }

    if (!result.value) {
      return false;
    }

    const { indexer } = result.value;

    // Send notification email to mentioned users
    this.processMetions(indexer, commentId, newContent, author);

    return true;
  }

  async deleteComment(commentId, author) {
    const discuCol = await getDiscussionCollection();
    let result = await discuCol.updateOne(
      {
        "comments.commentId": ObjectId(commentId),
      },
      {
        $pull: {
          comments: {
            commentId: ObjectId(commentId),
            authorId: author._id,
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

  async unsetCommentReaction(commentId, user) {
    const discuCol = await getDiscussionCollection();

    const result = await discuCol.updateOne(
      {
        "comments.commentId": ObjectId(commentId),
      },
      {
        $pull: {
          "comments.$.reactions": {
            userId: user._id,
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

  async setCommentReaction(commentId, reaction, user) {
    const discuCol = await getDiscussionCollection();

    const now = new Date();
    let result = await discuCol.updateOne(
      {
        comments: {
          $elemMatch: {
            commentId: ObjectId(commentId),
            "reactions.userId": user._id,
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
            "reaction.userId": user._id,
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
        comments: {
          $elemMatch: {
            commentId: ObjectId(commentId),
            authorId: { $ne: user._id },
          },
        },
      },
      {
        $push: {
          "comments.$.reactions": {
            userId: user._id,
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
