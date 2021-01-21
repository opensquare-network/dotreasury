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
}

export default new ScanApi(process.env.REACT_APP_SCAN_SERVER || "https://api.dotreasury.com/")
