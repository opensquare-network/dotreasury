import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewTipModal from "./NewTipModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";

export default function NewTipButton({ onFinalized }) {
  const account = useSelector(accountSelector);
  const [showNewTipModel, setShowNewTipModel] = useState(false);

  const isLoggedIn = !!account;

  let tooltipContent = "";
  if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  }

  return (
    <Tooltip
      showTooltip={!!tooltipContent}
      tooltipContent={<TooltipInfoText>{tooltipContent}</TooltipInfoText>}
    >
      <OnChainActionButton
        disabled={!account}
        onClick={() => setShowNewTipModel(true)}
      >
        New Tip
      </OnChainActionButton>
      <NewTipModal
        visible={showNewTipModel}
        setVisible={setShowNewTipModel}
        onFinalized={onFinalized}
      />
    </Tooltip>
  );
}
