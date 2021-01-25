const Router = require("koa-router");
const commentsController = require("./comments.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.patch(
  "/comments/:commentId",
  requireAuth,
  commentsController.updateComment
);
router.delete(
  "/comments/:commentId",
  requireAuth,
  commentsController.deleteComment
);
router.post(
  "/comments/:commentId/reaction",
  requireAuth,
  commentsController.setCommentReaction
);
router.delete(
  "/comments/:commentId/reaction",
  requireAuth,
  commentsController.unsetCommentReaction
);

module.exports = router;
