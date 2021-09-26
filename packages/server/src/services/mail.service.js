const aliMail = require("./alimail.service");
const templates = require("../templates");
const MarkdownIt = require('markdown-it');

class MailService {
  constructor() {
    this.md = new MarkdownIt();
  }

  async sendResetPasswordEmail({ username, email, token }) {
    const text = templates.resetPassword({
      username,
      email,
      token,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      html: text,
      subject: "Reset your account password",
      text,
      to: email,
    };

    try {
      await aliMail.sendMail(msg);
      return true;
    } catch (e) {
      console.error("Reset password Email not sent", e);
      return false;
    }
  }

  sendCommentMentionEmail({
    email,
    indexer,
    commentId,
    author,
    mentioned,
    content,
    commentPosition,
  }) {
    const defaultPageSize = 20;

    const text = templates.commentMention({
      author,
      mentioned,
      content: this.md.render(content),
      indexer,
      commentId,
      siteUrl: process.env.SITE_URL,
      page: Math.ceil(commentPosition / defaultPageSize),
    });

    const msg = {
      html: text,
      subject: "Someone mention you in comment",
      text,
      to: email,
    };

    aliMail.sendMail(msg).catch((e) =>
      console.error("Comment metion Email not sent", e)
    );
  }

  async sendVerificationEmail({ username, email, token }) {
    const text = templates.emailVerification({
      username,
      email,
      token,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      html: text,
      subject: "Please verify your email",
      text,
      to: email,
    };

    try {
      await aliMail.sendMail(msg);
      return true;
    } catch (e) {
      console.error("Verification Email not sent", e);
      return false;
    }
  }
}

module.exports = new MailService();
