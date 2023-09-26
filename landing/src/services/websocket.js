import io from "socket.io-client";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
const overviewRoom = "OVERVIEW_V2_ROOM";

const sockets = {};

export function connect(chain, { setHeight, setOverviewData }) {
  const WS_ENDPOINT = `${chain}-api.dotreasury.com`;

  if (sockets[chain]) {
    sockets[chain].emit("unsubscribe", chainStatusRoom);
    sockets[chain].emit("unsubscribe", overviewRoom);
    sockets[chain].disconnect();
  }

  sockets[chain] = io(WS_ENDPOINT);
  sockets[chain].connect();

  sockets[chain].on("connect", () => {
    sockets[chain].emit("subscribe", chainStatusRoom);
    sockets[chain].emit("subscribe", overviewRoom);

    sockets[chain].on("scanStatus", ({ height }) => {
      setHeight?.(height);
    });

    sockets[chain].on("overview_v2", (overview) => {
      setOverviewData?.(overview);
    });
  });
}
