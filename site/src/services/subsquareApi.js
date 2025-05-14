import Api from "./api";

const subsquareApi = new Api(import.meta.env.VITE_APP_SUBSQUARE_API_END_POINT);
export default subsquareApi;
