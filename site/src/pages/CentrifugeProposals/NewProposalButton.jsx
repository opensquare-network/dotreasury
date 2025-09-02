import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButton from "../../components/OnChainActionButton";
import NewProposalModal from "./NewProposalModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";
import { isKusama } from "../../utils/chains";

export default function NewProposalButton({ onFinalized }) {
  const account = useSelector(accountSelector);
  const [showNewProposalModel, setShowNewProposalModel] = useState(false);

  const isLoggedIn = !!account;

  let tooltipContent = "";
  let disabled = false;
  if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
    disabled = true;
  } else if (isKusama) {
    tooltipContent = "Treasury proposal should be submitted through OpenGov";
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
        onClick={() => setShowNewProposalModel(true)}
      >
        New Proposal
      </OnChainActionButton>
      {showNewProposalModel && (
        <NewProposalModal
          visible={showNewProposalModel}
          setVisible={setShowNewProposalModel}
          onFinalized={onFinalized}
        />
      )}
    </Tooltip>
  );
}
