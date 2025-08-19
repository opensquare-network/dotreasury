import io from "socket.io-client";
import store from "../store";
import { setScanHeight } from "../store/reducers/chainSlice";
import { setOverview } from "../store/reducers/overviewSlice";
import { getChainSettings } from "../utils/chains";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
const overviewRoom = "OVERVIEW_V2_ROOM";

let socket = null;

export function connect() {
  if (socket) {
    socket.emit("unsubscribe", chainStatusRoom);
    socket.emit("unsubscribe", overviewRoom);
    socket.disconnect();
  }

  const { api } = getChainSettings();
  socket = io(api?.socketIOUrl || "api.dotreasury.com");
  socket.connect();

  socket.on("connect", () => {
    socket.emit("subscribe", chainStatusRoom);
    socket.emit("subscribe", overviewRoom);

    socket.on("scanStatus", ({ height }) => {
      store.dispatch(setScanHeight(height));
    });

    socket.on("overview_v2", (overview) => {
      store.dispatch(setOverview(overview));
    });
  });
}
