import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";

export function useChain() {
  const chain = useSelector(chainSelector);
  return chain;
}

export function useIsKusamaChain() {
  const chain = useChain();
  return chain === "kusama";
}
