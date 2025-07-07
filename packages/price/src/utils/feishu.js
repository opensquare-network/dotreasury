const webhookUrl = process.env.FEISHU_WEBHOOK_URL;

async function sendFeishuNotification(data) {
  if (!webhookUrl) {
    throw new HttpError(500, "FEISHU_WEBHOOK_URL is not set");
  }

  const resp = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Failed to send Feishu notification: ${errorText}`);
  }

  ctx.body = {
    success: true,
  };
}

module.exports = {
  sendFeishuNotification,
};
