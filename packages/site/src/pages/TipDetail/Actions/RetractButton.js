import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useApi from "../../../hooks/useApi";
import { accountSelector } from "../../../store/reducers/accountSlice";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import { useIsMounted } from "../../../utils/hooks";
import { sendTx } from "../../../utils/sendTx";
import Tooltip from "../../../components/Tooltip";
import { TooltipInfoText } from "../../../components/Tooltip/styled";
import OnChainActionButtonSecondary from "../../../components/OnChainActionButtonSecondary";
import { isSameAddress } from "../../../utils";

export default function RetractedButton({ tipDetail, onFinalized }) {
  const api = useApi();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const isLoggedIn = !!account;
  const isClosed = tipDetail.latestState?.state === "TipClosed";
  const isRetracted = tipDetail.latestState?.state === "TipRetracted";
  const canRetract = isSameAddress(tipDetail.finder, account?.address);
  const disabled = !isLoggedIn || isClosed || isRetracted || !canRetract || isLoading;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doRetractTip = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!account) {
      return showErrorToast("Please connect wallet first");
    }

    if (!tipDetail) {
      return;
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const tx = api.tx.tips.retractTip(tipDetail.hash);

      await sendTx({
        txName: "Retract Tip",
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
  if (isClosed) {
    tooltipContent = "The tip is already closed";
  } else if (isRetracted) {
    tooltipContent = "The tip is already retracted";
  } else if (!canRetract) {
    tooltipContent = "Only the finder can retract this tip";
  } else if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  }

  return (
    <Tooltip
      showTooltip={!!tooltipContent}
      tooltipContent={
        tooltipContent && <TooltipInfoText>{tooltipContent}</TooltipInfoText>
      }
    >
      <OnChainActionButtonSecondary
        onClick={doRetractTip}
        disabled={disabled}
      >
        Retract Tip
      </OnChainActionButtonSecondary>
    </Tooltip>
  );
}
