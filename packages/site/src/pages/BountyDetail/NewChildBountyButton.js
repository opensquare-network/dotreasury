import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewChildBountyModal from "./NewChildBountyModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";

export default function NewChildBountyButton({ parentBountyId, onFinalized }) {
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
        New Child Bounty
      </OnChainActionButton>
      <NewChildBountyModal
        visible={showNewBountyModel}
        setVisible={setShowNewBountyModel}
        parentBountyId={parentBountyId}
        onFinalized={onFinalized}
      />
    </Tooltip>
  );
}
