const { ApiPromise, WsProvider } = require("@polkadot/api");
const {
  setApi, setProvider,
  env: { setChain, CHAINS }
} = require("@dotreasury/common");

jest.setTimeout(3000000);

describe("Burnt event", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setProvider(provider)
    setApi(api);
    setChain(CHAINS.KUSAMA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("parser works", async () => {
    const height = 9504000;
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const allEvents = await api.query.system.events.at(blockHash);
    const event = allEvents[2];
    expect(event.event.data[0].toString()).toBe("874753959928842");
  })
})
