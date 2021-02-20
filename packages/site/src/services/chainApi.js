import { ApiPromise, WsProvider } from "@polkadot/api";
import { isWeb3Injected, web3FromAddress } from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";

import { DEFAULT_NODE_URL, DEFAULT_NODES } from "../constants";

const apiInstanceMap = new Map();

let nodeUrl = (() => {
  const localNodeUrl = localStorage.getItem("nodeUrl");
  if (
    !localNodeUrl ||
    !DEFAULT_NODES.find((item) => item.url === localNodeUrl)
  ) {
    return DEFAULT_NODE_URL;
  }
  return localNodeUrl;
})();

export const getNodeUrl = () => nodeUrl;

export const getApi = async (queryUrl) => {
  const url = queryUrl || nodeUrl;
  if (!apiInstanceMap.has(url)) {
    apiInstanceMap.set(
      url,
      ApiPromise.create({ provider: new WsProvider(url) })
    );
  }
  return apiInstanceMap.get(url);
};

export async function getBlockHashFromHeight(blockHeight) {
  const api = await getApi();
  const value = await api.rpc.chain.getBlockHash(blockHeight);
  return value.toJSON();
}

export const getIndentity = async (address) => {
  const api = await getApi();
  const { identity } = await api.derive.accounts.info(address);
  return identity;
};

export const getTipCountdown = async () => {
  const api = await getApi();
  return api.consts.tips.tipCountdown.toNumber();
};

export const getTipFindersFee = async (blockHeightOrHash) => {
  let blockHash;
  if (typeof blockHeightOrHash === "number") {
    blockHash = await getBlockHashFromHeight(blockHeightOrHash);
  } else {
    blockHash = blockHeightOrHash;
  }
  const value = await getMetadataConstByBlockHash(blockHash, "Tips", "TipFindersFee");
  return value.toJSON();
};

export const getCurrentBlockHeight = async () => {
  const api = await getApi();
  const hash = await api.rpc.chain.getFinalizedHead();
  const block = await api.rpc.chain.getBlock(hash);
  return block.block.header.number.toNumber();
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
};

export const estimateBlocksTime = async (blocks) => {
  const api = await getApi();
  const nsPerBlock = api.consts.babe.expectedBlockTime.toNumber();
  return nsPerBlock * blocks;
};

export async function getMetadataConstByBlockHash(blockHash, moduleName, name) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);

  let iterVersion = 0;
  const metadata = registry.metadata.get("metadata");

  while (iterVersion < 1000) {
    if (!metadata[`isV${iterVersion}`]) {
      iterVersion++;
      continue;
    }

    const modules = metadata[`asV${iterVersion}`].get("modules");
    const targetModule = modules.find(
      (module) => module.name.toString() === moduleName
    );
    if (!targetModule) {
      // TODO: should throw error
      break;
    }

    const targetConstant = targetModule.constants.find(
      (constant) => constant.name.toString() === name
    );
    const typeName = targetConstant.type.toString();
    const Type = registry.registry.get(typeName);
    return new Type(registry.registry, targetConstant.value);
  }

  return null;
}
