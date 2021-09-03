import Api from "./api";
import { Subject } from "rxjs";

class ScanApi extends Api {
  jwtExpire = new Subject();

  async login(usernameOrEmail, password) {
    const { result, error } = await this.fetch(
      "/auth/login",
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      }
    );

    return { result, error };
  }

  async signup(username, email, password) {
    const { result, error } = await this.fetch(
      "/auth/signup",
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );

    return { result, error };
  }

  async maybeAuthFetch(url, params, options) {
    try {
      const storageToken = localStorage.getItem("token");
      if (storageToken) {
        const token = JSON.parse(storageToken);
        options = {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Bearer ${token.accessToken}`,
          },
        };
      }
    } catch {
      // ignore
    }

    return await this.fetch(url, params, options);
  }

  async authFetch(url, params, options) {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        this.jwtExpire.next();
        return {
          error: {
            status: 401,
            message: "Access token is not found",
          },
        };
      }

      options = {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${token.accessToken}`,
        },
      };
      const { result, error } = await this.fetch(url, params, options);

      if (result) {
        return { result };
      }

      if (error?.status === 401 && error?.message === "jwt expired") {
        console.warn("Access token expired, tring to refresh token.");
        // jwt expire
        const { result: refreshResult, error: refreshError } = await this.fetch(
          "/auth/refresh",
          {},
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          }
        );

        if (refreshResult) {
          console.log("New access token is acquired.");
          localStorage.setItem(
            "token",
            JSON.stringify({
              accessToken: refreshResult.accessToken,
              refreshToken: token.refreshToken,
            })
          );

          options.headers[
            "Authorization"
          ] = `Bearer ${refreshResult.accessToken}`;
          return await this.fetch(url, params, options);
        }

        if (refreshError) {
          console.error("Failed to refresh access token.");
          this.jwtExpire.next();
          return { error };
        }
      }

      return { error };
    } catch {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("token");
      // window.location.reload();
      return { result: null };
    }
  }
}

export default new ScanApi(
  process.env.REACT_APP_SCAN_SERVER || "https://api.dotreasury.com/"
);
