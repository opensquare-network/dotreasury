import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import IconMask from "../../components/Icon/Mask";
import { chainSelector } from "../../store/reducers/chainSlice";
import ExternalLink from "../../components/ExternalLink";
import { totalProposalCountSelector } from "../../store/reducers/overviewSlice";
import { isKusama, isPolkadot } from "../../utils/chains";
import { totalProposalsCountSelector } from "../../store/reducers/overviewSummarySlice";

function ProposalsMenuExternalLink() {
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
  if (isPolkadot) {
    return <ProposalsMenuExternalLink />;
  }

  if (isKusama) {
    return <ProposalsMenu />;
  }

  return <CentrifugeProposalsMenu />;
}
