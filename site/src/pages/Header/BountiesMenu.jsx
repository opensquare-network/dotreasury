import React, { useEffect } from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import IconMask from "../../components/Icon/Mask";
import { chainSelector } from "../../store/reducers/chainSlice";
import ExternalLink from "../../components/ExternalLink";
import { isKusama, isPolkadot } from "../../utils/chains";
import {
  fetchBountiesTotal,
  totalBountyCountSelector,
} from "../../store/reducers/bountySlice";

function BountiesMenuExternalLink() {
  const bountiesCount = useSelector(totalBountyCountSelector);
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (bountiesCount) {
      return;
    }

    dispatch(fetchBountiesTotal());
  }, [dispatch, bountiesCount]);

  return (
    <Menu.Item key="Bounties">
      <ExternalLink href={`https://${chain}.subsquare.io/treasury/bounties`}>
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
