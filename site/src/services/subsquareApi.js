import { currentChainSettings } from "../utils/chains";

const paramsKeyConvert = (str = "") =>
  str.replace(/[A-Z]/g, ([s]) => `_${s.toLowerCase()}`);

class Api {
  endpoint = null;

  constructor(endpoint = "") {
    this.endpoint = endpoint.replace(/\/+$/, "");
  }

  fetch = (path, params = {}, options) => {
    let url = this.endpoint + path;
    const searchParams = new URLSearchParams();
    for (const key of Object.keys(params)) {
      searchParams.set(paramsKeyConvert(key), params[key]);
    }
    url += `?${searchParams.toString()}`;

    return new Promise(async (resolve, reject) => {
      try {
        const resp = await window.fetch(url, options);
        if (resp.status !== 200) {
          const data = await resp.json();
          resolve({
            error: {
              status: resp.status,
              message: data.message,
              data: data.data,
            },
          });
        } else {
          const result = await resp.json();
          resolve({
            result,
          });
        }
      } catch {
        resolve({
          error: {
            message: "Unknown",
          },
        });
      }
    });
  };
}
const subsquareApi = new Api(currentChainSettings?.api?.subsquareApi);
export default subsquareApi;
