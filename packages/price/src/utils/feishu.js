const webhookUrl = process.env.FEISHU_WEBHOOK_URL;

async function sendFeishuNotification(message) {
  if (!webhookUrl) {
    throw new HttpError(500, "FEISHU_WEBHOOK_URL is not set");
  }

  const resp = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      msg_type: "text",
      content: message,
    }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Failed to send Feishu notification: ${errorText}`);
  }
}

module.exports = {
  sendFeishuNotification,
};
