const fetch = require("node-fetch");
const AbortController = require("abort-controller");

async function getKlines(startTime = 0) {
  const url = new URL("api/v3/klines", "https://api.binance.com");
  url.searchParams.set("symbol", "DOTUSDT");
  url.searchParams.set("interval", "1m");
  url.searchParams.set("limit", "500");
  url.searchParams.set("startTime", `${startTime}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 1500);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const json = await res.json();
    console.log(json);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("request was aborted");
    }
  } finally {
    clearTimeout(timeout);
  }
}

async function tick() {}

(async () => {
  await getKlines();
})();
