
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
