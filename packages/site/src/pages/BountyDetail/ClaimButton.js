import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useApi from "../../hooks/useApi";
import { accountSelector } from "../../store/reducers/accountSlice";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { useIsMounted } from "../../utils/hooks";
import { sendTx } from "../../utils/sendTx";
import { isSameAddress } from "../../utils";
import OnChainActionButton from "../../components/OnChainActionButton";
import { scanHeightSelector } from "../../store/reducers/chainSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";

export default function ClaimButton({ bounty, childBounty, onFinalized }) {
  const bountyDetail = childBounty || bounty;
  const isChildBounty = bountyDetail === childBounty;

  const api = useApi();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [isLoading, setIsLoading] = useState(false);
  const scanHeight = useSelector(scanHeightSelector);
  const isMounted = useIsMounted();

  const isLoggedIn = !!account;
  const isBeneficiary = isSameAddress(account?.address, bountyDetail?.beneficiary);
  const isPendingPayout = bountyDetail?.state?.state === "PendingPayout";
  const isUnlocked = bountyDetail?.unlockAt <= scanHeight;
  const disabled = !isLoggedIn || !isBeneficiary || !isPendingPayout || !isUnlocked || isLoading;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doClaim = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!bountyDetail) {
      return;
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const tx = isChildBounty
        ? api.tx.childBounties.claimChildBounty(bountyDetail.parentBountyId, bountyDetail.index)
        : api.tx.bounties.claimBounty(bountyDetail.bountyIndex);

      await sendTx({
        txName: "Claim Rewards",
        tx,
        signer: injector.signer,
        dispatch,
        signerAddress: account.address,
        isMounted,
        onFinalized,
      });
    } finally {
      setIsLoading(false);
    }
  };

  let tooltipContent = "";
  if (!isPendingPayout) {
    tooltipContent = "Only pending payout bounty is claimable";
  } else if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  } else if (!isBeneficiary) {
    tooltipContent = "Only the beneficiary can claim this bounty";
  } else if (!isUnlocked) {
    tooltipContent = "Can only be claimed when chain height reach unlock height";
  }

  return (
    <Tooltip showTooltip={!!tooltipContent} tooltipContent={<TooltipInfoText>{tooltipContent}</TooltipInfoText>}>
      <OnChainActionButton
        onClick={doClaim}
        disabled={disabled}
      >
        Claim Rewards
      </OnChainActionButton>
    </Tooltip>

  )
}
