const {
  chain: {
    getApi,
  },
  test: { disconnect, setKusama }
} = require("@osn/scan-common");

jest.setTimeout(3000000);

describe("Burnt event", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("parser works", async () => {
    const api = await getApi();
    const height = 9504000;
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const allEvents = await api.query.system.events.at(blockHash);
    const event = allEvents[2];
    expect(event.event.data[0].toString()).toBe("874753959928842");
  })
})
