const sgMail = require("@sendgrid/mail");
const nodeMailer = require("nodemailer");
const templates = require("../templates");
const MarkdownIt = require('markdown-it');

// Config SendGrid mailing service
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

// Config SMTP mailing service
let mailSender;
const mailSvc = process.env.MAIL_SERVICE;
const authUser = process.env.MAIL_AUTH_USER;
const authPass = process.env.MAIL_AUTH_PASS;
if (mailSvc && authUser && authPass) {
  mailSender = nodeMailer.createTransport({
    service: mailSvc,
    auth: {
      user: authUser,
      pass: authPass,
    },
  });
}

class MailService {
  constructor(from, mailSender) {
    this.from = from;
    this.send = (mailSender.sendMail || mailSender.send).bind(mailSender);
    this.md = new MarkdownIt();
  }

  sendResetPasswordEmail({ username, email, token }) {
    const text = templates.resetPassword({
      username,
      email,
      token,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      from: this.from,
      html: text,
      subject: "Reset your account password",
      text,
      to: email,
    };

    this.send(msg).catch((e) =>
      console.error("Reset password Email not sent", e)
    );
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
      from: this.from,
      html: text,
      subject: "Someone mention you in comment",
      text,
      to: email,
    };

    this.send(msg).catch((e) =>
      console.error("Comment metion Email not sent", e)
    );
  }

  sendVerificationEmail({ username, email, token }) {
    const text = templates.emailVerification({
      username,
      email,
      token,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      from: this.from,
      html: text,
      subject: "Please verify your email",
      text,
      to: email,
    };

    this.send(msg).catch((e) =>
      console.error("Verification Email not sent", e)
    );
  }
}

module.exports = new MailService(process.env.MAIL_FROM, mailSender || sgMail);
