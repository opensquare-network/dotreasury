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
    ctx.body = await commentService.updateComment(commentId, content, user._id);
  }

  async deleteComment(ctx) {
    const commentId = ctx.params.commentId;
    const user = ctx.request.user;
    ctx.body = await commentService.deleteComment(commentId, user._id);
  }

  async setCommentReaction(ctx) {
    const commentId = ctx.params.commentId;
    const { reaction } = ctx.request.body;
    const user = ctx.request.user;
    ctx.body = await commentService.setCommentReaction(
      commentId,
      reaction,
      user._id
    );
  }

  async unsetCommentReaction(ctx) {
    const commentId = ctx.params.commentId;
    const user = ctx.request.user;
    ctx.body = await commentService.unsetCommentReaction(commentId, user._id);
  }
}

module.exports = new CommentController();
