import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  isWeb3Injected,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { encodeAddress } from "@polkadot/keyring";

import {
  DEFAULT_KUSAMA_NODE_URL,
  DEFAULT_KUSAMA_NODES,
  DEFAULT_POLKADOT_NODE_URL,
  DEFAULT_POLKADOT_NODES,
} from "../constants";

const apiInstanceMap = new Map();

let nodeUrl = (() => {
  let localNodeUrl = null;
  try {
    localNodeUrl = JSON.parse(localStorage.getItem("nodeUrl"));
  } catch (e) {
    // ignore parse error
  }
  return {
    kusama:
      DEFAULT_KUSAMA_NODES.find((item) => item.url === localNodeUrl?.kusama)
        ?.url || DEFAULT_KUSAMA_NODE_URL,
    polkadot:
      DEFAULT_POLKADOT_NODES.find((item) => item.url === localNodeUrl?.polkadot)
        ?.url || DEFAULT_POLKADOT_NODE_URL,
  };
})();

export const getNodeUrl = () => nodeUrl;

export const getNodes = () => ({
  kusama: DEFAULT_KUSAMA_NODES,
  polkadot: DEFAULT_POLKADOT_NODES,
});

export const getApi = async (chain, queryUrl) => {
  const url = queryUrl || nodeUrl?.[chain];
  if (!apiInstanceMap.has(url)) {
    apiInstanceMap.set(
      url,
      ApiPromise.create({ provider: new WsProvider(url) }),
    );
  }
  return apiInstanceMap.get(url);
};

export const getTipCountdown = async (chain) => {
  const api = await getApi(chain);
  return api.consts.tips.tipCountdown.toNumber();
};

export const signMessage = async (text, address) => {
  if (!isWeb3Injected || !address) {
    return "";
  }

  const injector = await web3FromAddress(address);

  const data = stringToHex(text);
  const result = await injector.signer.signRaw({
    type: "bytes",
    data,
    address,
  });

  return result.signature;
};

export const signMessageWithExtension = async (
  text,
  address,
  extensionName,
) => {
  if (!extensionName) {
    throw new Error("Signing extension is not specified.");
  }

  let injector = null;

  const extension = window?.injectedWeb3?.[extensionName];
  if (extension) {
    injector = await extension.enable("doTreasury");
  } else {
    await web3Enable("doTreasury");
    injector = await web3FromAddress(address);
  }

  if (!injector) {
    throw new Error("Injector is not found");
  }

  const data = stringToHex(text);
  const result = await injector.signer.signRaw({
    type: "bytes",
    data,
    address,
  });

  return result.signature;
};

const extractBlockTime = (extrinsics) => {
  const setTimeExtrinsic = extrinsics.find(
    (ex) => ex.method.section === "timestamp" && ex.method.method === "set",
  );
  if (setTimeExtrinsic) {
    const { args } = setTimeExtrinsic.method.toJSON();
    return args.now;
  }
};

export const getBlockTime = async (chain, number) => {
  const api = await getApi(chain);
  const hash = await api.rpc.chain.getBlockHash(number);
  const block = await api.rpc.chain.getBlock(hash);
  const time = extractBlockTime(block.block.extrinsics);
  return time;
};

export const estimateBlocksTime = async (chain, blocks) => {
  const api = await getApi(chain);
  const nsPerBlock = api.consts.babe.expectedBlockTime.toNumber();
  return nsPerBlock * blocks;
};

export const encodeKusamaAddress = (address) => {
  try {
    return encodeAddress(address, 2);
  } catch {
    return "";
  }
};

export const encodePolkadotAddress = (address) => {
  try {
    return encodeAddress(address, 0);
  } catch {
    return "";
  }
};

export const encodeSubstrateAddress = (address) => {
  try {
    return encodeAddress(address, 42);
  } catch {
    return "";
  }
};

export const encodeChainAddress = (address, chain) => {
  let encodedAddress = encodeSubstrateAddress(address);

  if (chain === "kusama") {
    encodedAddress = encodeKusamaAddress(address);
  } else if (chain === "polkadot") {
    encodedAddress = encodePolkadotAddress(address);
  }

  return encodedAddress;
};

export async function getElectorate(api) {
  const issuance = await api.query.balances.totalIssuance();
  return issuance.toBigInt().toString();
}

export async function getReferendumInfo(api, referendumIndex) {
  const referendumInfo = await api.query.democracy.referendumInfoOf(
    referendumIndex,
  );
  return referendumInfo.toJSON();
}

export async function getBlockHeightFromHash(api, blockHash) {
  const block = await api.rpc.chain.getBlock(blockHash);
  const targetHeight = block.block.header.number.toNumber();
  return targetHeight;
}
