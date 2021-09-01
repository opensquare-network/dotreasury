jest.setTimeout(3000000);
process.env.CHAIN = "kusama";
process.env.KSM_WS_ENDPOINT = "wss://kusama.api.onfinality.io/public-ws";

const { getApi, disconnect } = require("../../api");
const { getBalance } = require("../../utils/freeBalance");
const { bnToBn } = require("@polkadot/util");

describe("test get balance", () => {
  let api;

  beforeAll(async () => {
    api = await getApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("of kusama at 6000000 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(6000000);
    const metadata = await api.rpc.state.getMetadata(blockHash);

    const balance = await getBalance(api, metadata, blockHash);

    expect(bnToBn(balance).toString()).toEqual("280709724673525019");
  });

  test("of kusama at 1468800 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(1468800);
    const metadata = await api.rpc.state.getMetadata(blockHash);

    const balance = await getBalance(api, metadata, blockHash);

    expect(bnToBn(balance).toString()).toEqual("165682945472844815");
  });

  test("of kusama at 500000 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(500000);

    const metadata = await api.rpc.state.getMetadata(blockHash);

    const balance = await getBalance(api, metadata, blockHash);
    expect(bnToBn(balance).toString()).toEqual("53322387585344548");
  });
});
