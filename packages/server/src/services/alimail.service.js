const Core = require('@alicloud/pop-core');

class AliMail {
  #client = new Core({
    accessKeyId: process.env.ALI_MAIL_KEY,
    accessKeySecret: process.env.ALI_MAIL_SECRET,
    endpoint: 'https://dm.aliyuncs.com',
    apiVersion: '2015-11-23'
  });

  sendMail({ to, text, html, subject }) {
    const requestOption = {
      method: "GET"
    };

    return this.#client.request(
      'SingleSendMail',
      {
        "AccountName": process.env.ALI_MAIL_FROM,
        "FromAlias": "dotreasury",
        "AddressType": 1,
        "ReplyToAddress": false,
        "ToAddress": to,
        "TextBody": text,
        "HtmlBody": html,
        "Subject": subject,
      },
      requestOption
    );
  }
}

module.exports = new AliMail();
