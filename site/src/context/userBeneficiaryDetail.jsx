import { createContext, useContext } from "react";
import useBeneficiaryDetail from "../hooks/useBeneficiaryDetail";

const Context = createContext({});

export function useUserBeneficiaryDetailData() {
  return useContext(Context) || {};
}

export function useUserBeneficiaryProposalsCounts() {
  const { data, loading } = useContext(Context) || {};

  const counts = {
    proposalsCount: data?.proposals?.benefitCount || 0,
    bountiesCount: data?.bounties?.benefitCount || 0,
    childBountiesCount: data?.childBounties?.benefitCount || 0,
    tipsCount: data?.tips?.benefitCount || 0,
    spendsCount: data?.spends?.benefitCount || 0,
  };
  return {
    counts,
    loading,
  };
}

export function useUserBeneficiaryAwardValue() {
  const { data, loading } = useContext(Context) || {};

  return {
    value: data?.totalBenefitFiatValue || 0,
    loading,
  };
}

export default function UserBeneficiaryDetailProvider({ children, address }) {
  const { data, loading } = useBeneficiaryDetail(address);

  return (
    <Context.Provider
      value={{
        data,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  );
}
