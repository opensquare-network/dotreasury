import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalProposalCountSelector } from "../../store/reducers/overviewSlice";

function ProposalsMenu() {
  const proposalsCount = useSelector(totalProposalCountSelector);

  return (
    <Menu.Item key="Proposals">
      Proposals<Label>{proposalsCount}</Label>
    </Menu.Item>
  );
}

export default ProposalsMenu;
