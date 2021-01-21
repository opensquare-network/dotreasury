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

  async authFetch(url, params, options, user) {
    options.headers = {...options.headers, Authorization: `Bearer ${user.accessToken}` };
    const { result, error } = await this.fetch(url, params, options);

    if (result) {
      return { result };
    }

    if (error.status === 401 && error.data?.message === "jwt expired") {
      // jwt expire
      const { result: refreshResult } = await this.fetch('/auth/refresh', {}, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: user.refreshToken })
      });

      if (refreshResult) {
        options.headers['Authorization'] = `Bearer ${refreshResult.accessToken}`;
        return await this.fetch(url, params, options);
      }
    }

    return { error };
  }
}

export default new ScanApi(process.env.REACT_APP_SCAN_SERVER || "https://api.dotreasury.com/")
