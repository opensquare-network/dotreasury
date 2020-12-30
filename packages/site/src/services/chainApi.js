
import { ApiPromise, WsProvider } from '@polkadot/api';

let api = null;
const wsProvider = new WsProvider('wss://kusama.elara.patract.io/');

export const getApi = async () => {
  if (!api) {
    api = ApiPromise.create({ provider: wsProvider });
  }
  return api;
}

export const getIndentity = async (address) => {
  const api = await getApi();
  const {identity} = await api.derive.accounts.info(address);
  return identity;
}

export const getTipCountdown = async () => {
  const api = await getApi();
  return api.consts.treasury.tipCountdown.toNumber();
}

export const getTipFindersFee = async () => {
  const api = await getApi();
  return api.consts.treasury.tipFindersFee.toNumber();
}

export const getCurrentBlockHeight = async () => {
  const api = await getApi();
  const hash = await api.rpc.chain.getFinalizedHead();
  const block = await api.rpc.chain.getBlock(hash);
  return block.block.header.number.toNumber();
}
