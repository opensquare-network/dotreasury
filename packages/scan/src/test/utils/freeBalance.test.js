jest.setTimeout(3000000);

const { setApi } = require("../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { getTreasuryBalanceV2: getBalance } = require("../../utils/freeBalance");
const { bnToBn } = require("@polkadot/util");

describe("test get balance", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("of kusama at 6000000 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(6000000);

    const balance = await getBalance(blockHash);

    expect(bnToBn(balance).toString()).toEqual("280709724673525019");
  });

  test("of kusama at 1468800 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(1468800);

    const balance = await getBalance(blockHash);

    expect(bnToBn(balance).toString()).toEqual("165682945472844815");
  });

  test("of kusama at 1382400 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(1382400);

    const balance = await getBalance(blockHash);

    expect(bnToBn(balance).toString()).toEqual("165660839712844015");
  });

  test("of kusama at 500000 works", async () => {
    const blockHash = await api.rpc.chain.getBlockHash(500000);

    const balance = await getBalance(blockHash);
    expect(bnToBn(balance).toString()).toEqual("53322387585344548");
  });
});
