import io from "socket.io-client";
import store from "../store";
import { setScanHeight } from "../store/reducers/chainSlice";
import { setOverview } from "../store/reducers/overviewSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
const overviewRoom = "OVERVIEW_ROOM";
const socket = io(process.env.REACT_APP_SOCKET_IO_URL || "api.dotreasury.com");
socket.connect();

socket.on("connect", () => {
  socket.emit("subscribe", chainStatusRoom);
  socket.emit("subscribe", overviewRoom);

  socket.on("scanStatus", ({ height }) => {
    console.log("height", height);
    store.dispatch(setScanHeight(height));
  });

  socket.on("overview", (overview) => {
    console.log(overview);
    store.dispatch(setOverview(overview));
  });
});
