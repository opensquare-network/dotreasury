import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../../../hooks/useApi";
import { accountSelector } from "../../../store/reducers/accountSlice";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import { useIsMounted } from "../../../utils/hooks";
import { sendTx } from "../../../utils/sendTx";
import { isSameAddress } from "../../../utils";
import OnChainActionButton from "../../../components/OnChainActionButton";

export default function ClaimButton({ parentBountyId, index, beneficiary, onInBlock, onFinalized }) {
  const api = useApi();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const isBeneficiary = isSameAddress(account?.address, beneficiary);
  const disabled = !isBeneficiary || isLoading;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doClaim = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (parentBountyId === undefined || index === undefined) {
      return;
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const tx = api.tx.childBounties.claimChildBounty(parentBountyId, index);

      await sendTx({
        txName: "Claim Rewards",
        tx,
        signer: injector.signer,
        dispatch,
        signerAddress: account.address,
        isMounted,
        onInBlock,
        onFinalized,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnChainActionButton
      onClick={doClaim}
      disabled={disabled}
    >
      Claim Rewards
    </OnChainActionButton>
  )
}
