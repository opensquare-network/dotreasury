import io from "socket.io-client";
import store from "../store";
import { setScanHeight } from "../store/reducers/chainSlice";
import { setOverview } from "../store/reducers/overviewSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
const overviewRoom = "OVERVIEW_V2_ROOM";

let socket = null;

export function connect(chain) {
  if (socket) {
    socket.emit("unsubscribe", { chain, data: chainStatusRoom });
    socket.emit("unsubscribe", { chain, data: overviewRoom });
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_APP_SOCKET_IO_URL || "api.dotreasury.com");
  socket.connect();

  socket.on("connect", () => {
    socket.emit("subscribe", { chain, data: chainStatusRoom });
    socket.emit("subscribe", { chain, data: overviewRoom });

    socket.on("scanStatus", ({ height }) => {
      store.dispatch(setScanHeight(height));
    });

    socket.on("overview_v2", (overview) => {
      store.dispatch(setOverview(overview));
    });
  });
}
