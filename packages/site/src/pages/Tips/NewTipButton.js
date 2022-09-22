import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewTipModal from "./NewTipModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Popper from "../../components/Popper";
import { TooltipInfoText } from "../../components/Popper/styled";

export default function NewTipButton({ onFinalized }) {
  const account = useSelector(accountSelector);
  const [showNewTipModel, setShowNewTipModel] = useState(false);

  const isLoggedIn = !!account;

  let tooltipContent = "";
  if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  }

  return (
    <Popper
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
    </Popper>
  );
}
