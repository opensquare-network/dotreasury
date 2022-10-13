import { useState } from "react";
import { useSelector } from "react-redux";
import OnChainActionButtonSecondary from "../../components/OnChainActionButtonSecondary";
import EndorseTipsModal from "./EndorseTipsModal";
import { accountSelector } from "../../store/reducers/accountSlice";
import Tooltip from "../../components/Tooltip";
import { TooltipInfoText } from "../../components/Tooltip/styled";
import useCouncilMembers from "../../utils/useCouncilMembers";

export default function EndorseTipsButton({ onFinalized }) {
  const account = useSelector(accountSelector);
  const [showEndorseModal, setShowEndorseModal] = useState(false);
  const councilMembers = useCouncilMembers();

  const isCouncilor = councilMembers?.includes(account?.address);

  const isLoggedIn = !!account;
  const disabled = !isLoggedIn || !isCouncilor;
  const visible = isCouncilor;

  let tooltipContent = "";
  if (!isLoggedIn) {
    tooltipContent = "Please connect wallet first";
  } else if (!isCouncilor) {
    tooltipContent = "Only councilors can endorse tips";
  }

  if (!visible) {
    return null;
  }

  return (
    <Tooltip
      showTooltip={!!tooltipContent}
      tooltipContent={<TooltipInfoText>{tooltipContent}</TooltipInfoText>}
    >
      <OnChainActionButtonSecondary
        disabled={disabled}
        onClick={() => setShowEndorseModal(true)}
      >
        Endorse
      </OnChainActionButtonSecondary>
      {showEndorseModal && (
        <EndorseTipsModal
          size={"large"}
          visible={showEndorseModal}
          setVisible={setShowEndorseModal}
          onFinalized={onFinalized}
        />
      )}
    </Tooltip>
  );
}
