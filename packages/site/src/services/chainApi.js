
import { ApiPromise, WsProvider } from '@polkadot/api';
import { isWeb3Injected, web3FromAddress } from '@polkadot/extension-dapp'
import { stringToHex } from '@polkadot/util';

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

export const signMessage = async (text, address) => {
  if (!isWeb3Injected || !address) {
    return "";
  }

  const injector = await web3FromAddress(address);

  const data = stringToHex(text);
  const result = await injector.signer.signRaw({
    type: 'bytes',
    data,
    address,
  });

  return result.signature;
}

const extractBlockTime = (extrinsics) => {
  const setTimeExtrinsic = extrinsics.find(
    (ex) => ex.method.section === "timestamp" && ex.method.method === "set"
  );
  if (setTimeExtrinsic) {
    const { args } = setTimeExtrinsic.method.toJSON();
    return args.now;
  }
};

export const getBlockTime = async (number) => {
  const api = await getApi();
  const hash = await api.rpc.chain.getBlockHash(number);
  const block = await api.rpc.chain.getBlock(hash);
  const time = extractBlockTime(block.block.extrinsics);
  return time;
}
