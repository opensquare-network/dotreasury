const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");

class CommentController {
  async updateComment(ctx) {
    const commentId = ctx.params.commentId;
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }
    ctx.body = await commentService.updateComment(commentId, content, user);
  }

  async deleteComment(ctx) {
    const commentId = ctx.params.commentId;
    const user = ctx.request.user;
    ctx.body = await commentService.deleteComment(commentId, user);
  }

  async setCommentReaction(ctx) {
    const commentId = ctx.params.commentId;
    const { reaction } = ctx.request.body;
    const user = ctx.request.user;
    ctx.body = await commentService.setCommentReaction(
      commentId,
      reaction,
      user
    );
  }

  async unsetCommentReaction(ctx) {
    const commentId = ctx.params.commentId;
    const user = ctx.request.user;
    ctx.body = await commentService.unsetCommentReaction(commentId, user);
  }
}

module.exports = new CommentController();
