import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import IconMask from "../../components/Icon/Mask";
import { chainSelector } from "../../store/reducers/chainSlice";
import ExternalLink from "../../components/ExternalLink";
import { totalProposalsCountSelector } from "../../store/reducers/overviewSummarySlice";

export default function ProposalsMenuWrapper() {
  const proposalsCount = useSelector(totalProposalsCountSelector);
  const chain = useSelector(chainSelector);

  return (
    <Menu.Item key="Proposals">
      <ExternalLink href={`https://${chain}.subsquare.io/treasury/proposals`}>
        Proposals
        <IconMask
          src="/imgs/caret-up-right.svg"
          color="textSecondary"
          size={16}
        />
        <Label>{proposalsCount}</Label>
      </ExternalLink>
    </Menu.Item>
  );
}
