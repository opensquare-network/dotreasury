import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import useApi from "../../../hooks/useApi";
import { accountSelector } from "../../../store/reducers/accountSlice";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import { useIsMounted } from "../../../utils/hooks";
import { sendTx } from "../../../utils/sendTx";
import OnChainActionButton from "../../../components/OnChainActionButton";
import { scanHeightSelector } from "../../../store/reducers/chainSlice";
import Tooltip from "../../../components/Tooltip";
import { TooltipInfoText } from "../../../components/Tooltip/styled";

export default function CloseButton({ tipDetail, onFinalized }) {
  const api = useApi();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [isLoading, setIsLoading] = useState(false);
  const scanHeight = useSelector(scanHeightSelector);
  const isMounted = useIsMounted();

  const isLoggedIn = !!account;
  const isClosed = tipDetail.latestState?.state === "TipClosed";
  const isRetracted = tipDetail.latestState?.state === "TipRetracted";
  const closing = !!tipDetail.closeFromBlockHeight;
  const canClose = closing && scanHeight > tipDetail.closeFromBlockHeight;
  const disabled = !isLoggedIn || isClosed || isRetracted || !canClose || isLoading;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doCloseTip = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!tipDetail) {
      return;
    }

    setIsLoading(true);

    try {
      web3Enable("doTreasury");
      const injector = await web3FromSource(account.extension);

      const tx = api.tx.tips.closeTip(tipDetail.hash);

      await sendTx({
        txName: "Close Tip",
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
  } else if (!closing) {
    tooltipContent = "This tip has not gotten enough endorsements";
  } else if (!canClose) {
    tooltipContent = "Not ready to close, please wait until the countdown is end";
  } else if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  }

  return (
    <Tooltip
      showTooltip={!!tooltipContent}
      tooltipContent={<TooltipInfoText>{tooltipContent}</TooltipInfoText>}
    >
      <OnChainActionButton
        onClick={doCloseTip}
        disabled={disabled}
      >
        Close Tip
      </OnChainActionButton>
    </Tooltip>
  );
}
