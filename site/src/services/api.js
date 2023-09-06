const paramsKeyConvert = (str = "") =>
  str.replace(/[A-Z]/g, ([s]) => `_${s.toLowerCase()}`);

class Api {
  endpoint = null;

  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  fetch = (path, params = {}, options) => {
    const url = new URL(path, this.endpoint);
    for (const key of Object.keys(params)) {
      url.searchParams.set(paramsKeyConvert(key), params[key]);
    }

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

export default Api;
