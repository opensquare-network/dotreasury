import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import { CHAINS } from "../../constants";

export function useChain() {
  const chain = useSelector(chainSelector);
  return chain;
}

export function useSupportOpenGov() {
  const chain = useChain();
  return [CHAINS.KUSAMA, CHAINS.POLKADOT].includes(chain);
}
