import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewProposalModal from "./NewProposalModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";

export default function NewProposalButton({ onFinalized }) {
  const account = useSelector(accountSelector);
  const [showNewProposalModel, setShowNewProposalModel] = useState(false);

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
        onClick={() => setShowNewProposalModel(true)}
      >
        New Proposal
      </OnChainActionButton>
      <NewProposalModal
        visible={showNewProposalModel}
        setVisible={setShowNewProposalModel}
        onFinalized={onFinalized}
      />
    </Tooltip>
  );
}
