
import { ApiPromise, WsProvider } from '@polkadot/api';
import { isWeb3Injected, web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { stringToU8a, hexToU8a, isHex } from '@polkadot/util';

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

function toSS58Address(address) {
  try {
    return encodeAddress(
      isHex(address)
        ? hexToU8a(address)
        : decodeAddress(address)
      , 2
    );

  } catch (error) {
    throw new Error("Invalid address");
  }
};

export const signMessage = async (text, address) => {
  const ss58Address = toSS58Address(address);

  await web3Enable("doTreasury");
  if (!isWeb3Injected) {
    return "";
  }

  const injector = await web3FromAddress(address);

  const data = stringToU8a(text);
  const result = await injector.signer.signRaw({
    type: 'bytes',
    ...data,
    address: ss58Address,
  });

  return result.signature;
}
