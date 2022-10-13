import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewChildBountyModal from "./NewChildBountyModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";
import { isSameAddress } from "../../utils";
import { bountyDetailSelector } from "../../store/reducers/bountySlice";

export default function NewChildBountyButton({ parentBountyId, onFinalized }) {
  const account = useSelector(accountSelector);
  const bounty = useSelector(bountyDetailSelector)
  const [showNewBountyModel, setShowNewBountyModel] = useState(false);

  const isLoggedIn = !!account;
  const canPropose = isSameAddress(bounty?.curator, account?.address);
  const isActive = bounty?.state?.state === "Active";

  const disabled = !isLoggedIn || !isActive || !canPropose;

  let tooltipContent = "";
  if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  } else if (!isActive) {
    tooltipContent = "The bounty is not active yet";
  } else if (!canPropose) {
    tooltipContent = "Only the curator can create child bounties";
  }

  return (
    <Tooltip
      showTooltip={!!tooltipContent}
      tooltipContent={<TooltipInfoText>{tooltipContent}</TooltipInfoText>}
    >
      <OnChainActionButton
        disabled={disabled}
        onClick={() => setShowNewBountyModel(true)}
      >
        New Child Bounty
      </OnChainActionButton>
      {showNewBountyModel && (
        <NewChildBountyModal
          visible={showNewBountyModel}
          setVisible={setShowNewBountyModel}
          parentBountyId={parentBountyId}
          onFinalized={onFinalized}
        />
      )}
    </Tooltip>
  );
}
