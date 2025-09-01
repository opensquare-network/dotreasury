import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalProposalCountSelector } from "../../store/reducers/overviewSlice";
import { isKusama, isPolkadot } from "../../utils/chains";
import { totalProposalsCountSelector } from "../../store/reducers/overviewSummarySlice";

function ProposalsMenu() {
  const proposalsCount = useSelector(totalProposalsCountSelector);

  return (
    <Menu.Item key="Proposals">
      Proposals<Label>{proposalsCount}</Label>
    </Menu.Item>
  );
}

function CentrifugeProposalsMenu() {
  const proposalsCount = useSelector(totalProposalCountSelector);

  return (
    <Menu.Item key="Proposals">
      Proposals<Label>{proposalsCount}</Label>
    </Menu.Item>
  );
}

export default function ProposalsMenuWrapper() {
  if (isPolkadot || isKusama) {
    return <ProposalsMenu />;
  }

  return <CentrifugeProposalsMenu />;
}
