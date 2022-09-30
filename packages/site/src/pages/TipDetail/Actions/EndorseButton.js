import { useState } from "react";
import { useSelector } from "react-redux";

import { accountSelector } from "../../../store/reducers/accountSlice";
import OnChainActionButton from "../../../components/OnChainActionButton";
import Tooltip from "../../../components/Tooltip";
import { TooltipInfoText } from "../../../components/Tooltip/styled";
import EndorseModal from "./EndorseModal";

export default function EndorseButton({ tipDetail, onFinalized }) {
  const account = useSelector(accountSelector);
  const [showEndorse, setShowEndorse] = useState(false);

  const isLoggedIn = !!account;
  const isClosed = tipDetail.latestState?.state === "TipClosed";
  const isRetracted = tipDetail.latestState?.state === "TipRetracted";
  const disabled = !isLoggedIn || isClosed || isRetracted;

  let tooltipContent = "";
  if (isClosed) {
    tooltipContent = "The tip is already closed";
  } else if (isRetracted) {
    tooltipContent = "The tip is already retracted";
  } else if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  }

  return (
    <>
      <Tooltip
        showTooltip={!!tooltipContent}
        tooltipContent={<TooltipInfoText>{tooltipContent}</TooltipInfoText>}
      >
        <OnChainActionButton
          onClick={() => setShowEndorse(true)}
          disabled={disabled}
        >
          Endorse
        </OnChainActionButton>
      </Tooltip>
      <EndorseModal
        tipDetail={tipDetail}
        visible={showEndorse}
        setVisible={setShowEndorse}
        onFinalized={onFinalized}
      />
    </>
  );
}
