import Api from "./api";

export default new Api(process.env.REACT_APP_SCAN_SERVER || "https://api.dotreasury.com/")
