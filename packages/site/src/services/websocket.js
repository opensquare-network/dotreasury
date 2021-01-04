import io from "socket.io-client";
import store from "../store";
import { setScanHeight } from "../store/reducers/chainSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
const socket = io(process.env.REACT_APP_SOCKET_IO_URL || "api.dotreasury.com");
socket.connect();

socket.on("connect", () => {
  socket.emit("subscribe", chainStatusRoom);

  socket.on("scanStatus", ({ height }) => {
    store.dispatch(setScanHeight(height));
  });
});
