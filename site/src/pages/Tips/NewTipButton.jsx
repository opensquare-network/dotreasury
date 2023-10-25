import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewTipModal from "./NewTipModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";
import { isKusama } from "../../utils/chains";

export default function NewTipButton({ onFinalized }) {
  const account = useSelector(accountSelector);
  const [showNewTipModal, setShowNewTipModal] = useState(false);

  const isLoggedIn = !!account;

  let tooltipContent = "";
  let disabled = false;
  if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
    disabled = true;
  } else if (isKusama) {
    tooltipContent = "Treasury tip should be submitted through OpenGov";
    disabled = true;
  }

  return (
    <Tooltip
      showTooltip={!!tooltipContent}
      tooltipContent={
        tooltipContent && <TooltipInfoText>{tooltipContent}</TooltipInfoText>
      }
    >
      <OnChainActionButton
        disabled={disabled}
        onClick={() => setShowNewTipModal(true)}
      >
        New Tip
      </OnChainActionButton>
      {showNewTipModal && (
        <NewTipModal
          visible={showNewTipModal}
          setVisible={setShowNewTipModal}
          onFinalized={onFinalized}
        />
      )}
    </Tooltip>
  );
}
