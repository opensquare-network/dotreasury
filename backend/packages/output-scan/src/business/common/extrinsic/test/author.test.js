const { findExtrinsicRealAuthor } = require("../author");
const {
  chain: {
    getApi,
  },
  test: { setPolkadot, disconnect }
} = require("@osn/scan-common");
jest.setTimeout(3000000);

describe("Extract author from", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("proxy extrinsic works", async () => {
    const blockHeight = 11927268;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const block = await api.rpc.chain.getBlock(blockHash);

    const author = await findExtrinsicRealAuthor(block.block.extrinsics[3], {blockHeight, blockHash});
    expect(author).toEqual("1dGsgLgFez7gt5WjX2FYzNCJtaCjGG6W9dA42d9cHngDYGg");
  })

  test("multisig extrinsic works", async () => {
    const blockHeight = 8733704;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const block = await api.rpc.chain.getBlock(blockHash);

    const author = await findExtrinsicRealAuthor(block.block.extrinsics[2], {blockHeight, blockHash});
    expect(author).toEqual("15iEcRaBLKXFt1btE82v358cAzaWyJDbrtkuLhQVf2Voou9K");
  })

  test("normal extrinsic works", async () => {
    const blockHeight = 11938751;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const block = await api.rpc.chain.getBlock(blockHash);

    const author = await findExtrinsicRealAuthor(block.block.extrinsics[2], {blockHeight, blockHash});
    expect(author).toEqual("1267iEPtMYoSVvLoq9ssNNT1eVsQwtmdrTTqiq7U7xesgP8g");
  })
})
