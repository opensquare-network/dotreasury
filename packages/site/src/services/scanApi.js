import Api from "./api";

class ScanApi extends Api {
  async login(username, password) {
    const { result } = await this.fetch("/auth/login", {}, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    return result;
  }

  async signup(username, email, password) {
    const { result } = await this.fetch("/auth/signup", {}, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    return result;
  }

  async authFetch(url, params, options) {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      console.error("Access token is not found.");
      return {};
    }

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token.accessToken}`
    };
    const { result, error } = await this.fetch(url, params, options);

    if (result) {
      return { result };
    }

    if (error?.status === 401 && error?.message === "jwt expired") {
      console.warn("Access token expired, tring to refresh token.");
      // jwt expire
      const { result: refreshResult } = await this.fetch('/auth/refresh', {}, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: token.refreshToken })
      });

      if (refreshResult) {
        console.log("New access token is acquired.");
        localStorage.setItem("token", JSON.stringify({
          accessToken: refreshResult.accessToken,
          refreshToken: token.refreshToken,
        }));

        options.headers['Authorization'] = `Bearer ${refreshResult.accessToken}`;
        return await this.fetch(url, params, options);
      } else {
        console.error("Failed to refresh access token.")
      }
    }

    return { error };
  }
}

export default new ScanApi(process.env.REACT_APP_SCAN_SERVER || "https://api.dotreasury.com/")
