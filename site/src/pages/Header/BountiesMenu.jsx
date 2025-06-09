import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalBountyCountSelector } from "../../store/reducers/overviewSlice";
import IconMask from "../../components/Icon/Mask";
import { chainSelector } from "../../store/reducers/chainSlice";
import ExternalLink from "../../components/ExternalLink";
import { isKusama, isPolkadot } from "../../utils/chains";

function BountiesMenuExternalLink() {
  const bountiesCount = useSelector(totalBountyCountSelector);
  const chain = useSelector(chainSelector);

  return (
    <Menu.Item key="Bounties">
      <ExternalLink
        href={`https://${chain}.subsquare.io/treasury/bounties`}
        target="_blank"
        rel="noreferrer"
      >
        Bounties
        <IconMask
          src="/imgs/caret-up-right.svg"
          color="textSecondary"
          size={16}
        />
        <Label>{bountiesCount}</Label>
      </ExternalLink>
    </Menu.Item>
  );
}

function BountiesMenu() {
  const bountiesCount = useSelector(totalBountyCountSelector);

  return (
    <Menu.Item key="Bounties">
      Bounties<Label>{bountiesCount}</Label>
    </Menu.Item>
  );
}

export default function BountiesEntry() {
  if (isPolkadot || isKusama) {
    return <BountiesMenuExternalLink />;
  }

  return <BountiesMenu />;
}
