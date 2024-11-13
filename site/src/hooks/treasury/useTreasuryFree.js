import { useChain } from "../../utils/hooks/chain";
import { CHAINS } from "../../utils/chains";
import { useAssetHubAsset } from "../assetHub/useAssetHubAsset";

export const StatemintAssets = [
  {
    id: 1984,
    symbol: "USDt",
    decimals: 6,
  },
  {
    id: 1337,
    symbol: "USDC",
    decimals: 6,
  },
];

export const getAssetBySymbol = (symbol) =>
  StatemintAssets.find((asset) => asset.symbol === symbol);

export const StatemintFellowShipSalaryAccount =
  "13w7NdvSR1Af8xsQTArDtZmVvjE8XhWNdL4yed3iFHrUNCnS";

export default function useQueryFellowshipSalaryBalance(symbol) {
  const chain = useChain();

  let salaryAccount = null;

  if (chain === CHAINS.polkadot) {
    salaryAccount = StatemintFellowShipSalaryAccount;
  }

  const asset = getAssetBySymbol(symbol);
  return useAssetHubAsset(asset.id, salaryAccount);
}
