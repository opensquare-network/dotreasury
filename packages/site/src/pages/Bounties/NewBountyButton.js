import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewBountyModal from "./NewBountyModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";

export default function NewBountyButton({ onFinalized }) {
  const account = useSelector(accountSelector);
  const [showNewBountyModel, setShowNewBountyModel] = useState(false);

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
        onClick={() => setShowNewBountyModel(true)}
      >
        New Bounty
      </OnChainActionButton>
      {showNewBountyModel && (
        <NewBountyModal
          visible={showNewBountyModel}
          setVisible={setShowNewBountyModel}
          onFinalized={onFinalized}
        />
      )}
    </Tooltip>
  );
}
