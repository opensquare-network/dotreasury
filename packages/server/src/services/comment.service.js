const { ObjectId } = require("mongodb");
const mailService = require("./mail.service");
const { getCommentCollection, getUserCollection } = require("../mongo-admin");
const { HttpError } = require("../exc");
const { DefaultUserNotification } = require("../contants");

class CommentService {
  async getComments(indexer) {
    const commentCol = await getCommentCollection();
    let comments = await commentCol
      .find(
        { indexer },
        {
          projection: {
            indexer: 0,
          },
          sort: [["createdAt", 1]],
        }
      )
      .toArray();

    if (comments.length > 0) {
      const userIds = new Set();
      comments.forEach((comment) => {
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

      comments.forEach((comment) => {
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
    }

    return comments;
  }

  async postComment(indexer, content, author) {
    const commentCol = await getCommentCollection();

    const now = new Date();
    const result = await commentCol.insertOne({
      indexer,
      authorId: author._id,
      content,
      createdAt: now,
      updatedAt: now,
    });

    if (!result.result.ok) {
      throw new HttpError(500, "Post comment error.");
    }

    const commentId = result.ops[0]._id;

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
      if (
        user.emailVerified &&
        (user.notification?.mentioned ?? DefaultUserNotification.mentioned)
      ) {
        mailService.sendCommentMentionEmail({
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
    const commentCol = await getCommentCollection();

    const now = new Date();
    const result = await commentCol.findOneAndUpdate(
      {
        _id: ObjectId(commentId),
        authorId: author._id,
      },
      {
        $set: {
          content: newContent,
          updatedAt: now,
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
    const commentCol = await getCommentCollection();
    let result = await commentCol.deleteOne({
      _id: ObjectId(commentId),
      authorId: author._id,
    });

    if (!result.result.ok) {
      throw new HttpError(500, "Delete comment error.");
    }

    return true;
  }

  async unsetCommentReaction(commentId, user) {
    const commentCol = await getCommentCollection();

    const result = await commentCol.updateOne(
      {
        _id: ObjectId(commentId),
      },
      {
        $pull: {
          reactions: {
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
    const commentCol = await getCommentCollection();

    const now = new Date();
    let result = await commentCol.updateOne(
      {
        _id: ObjectId(commentId),
        "reactions.userId": user._id,
      },
      {
        $set: {
          "reactions.$.reaction": reaction,
          "reactions.$.updatedAt": now,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, update reaction.");
    }

    if (result.result.nModified > 0) {
      return true;
    }

    result = await commentCol.updateOne(
      {
        _id: ObjectId(commentId),
        authorId: { $ne: user._id },
      },
      {
        $push: {
          reactions: {
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
