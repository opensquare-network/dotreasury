const sgMail = require("@sendgrid/mail");
const nodeMailer = require("nodemailer");
const templates = require("../templates");

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
  }

  sendResetPasswordEmail({ username, email, token }) {
    const text = templates.resetpassword({
      username,
      email,
      token,
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

  sendCommentMetionEmail({
    email,
    indexer,
    commentId,
    author,
    mentioned,
    content,
  }) {
    const text = templates.commentmention({
      author,
      mentioned,
      content,
      indexer,
      commentId,
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
}

module.exports = new MailService(
  "noreply@dotreasury.com",
  mailSender || sgMail
);
