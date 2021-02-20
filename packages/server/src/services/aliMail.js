const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: process.env.ALI_MAIL_KEY,
  accessKeySecret: process.env.ALI_MAIL_SECRET,
  endpoint: 'https://dm.aliyuncs.com',
  apiVersion: '2015-11-23'
});

const params = {
  "AccountName": process.env.ALI_MAIL_FROM,
  "FromAlias": "dotreasury",
  "AddressType": 1,
  "ReplyToAddress": false,
  "Subject": "test",
  "HtmlBody": "test"
};

var requestOption = {
  method: 'GET'
};

const sendAliMail = (to) => {
  client.request('SingleSendMail', { "ToAddress": to, ...params }, requestOption).then((result) => {
    console.log(JSON.stringify(result));
  }, (ex) => {
    console.log(ex);
  })
}

module.exports = { sendAliMail };
