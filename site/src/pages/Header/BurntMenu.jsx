import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import IconMask from "../../components/Icon/Mask";
import { chainSelector } from "../../store/reducers/chainSlice";
import ExternalLink from "../../components/ExternalLink";
import { isKusama, isPolkadot } from "../../utils/chains";
import { totalBurntCountSelector } from "../../store/reducers/overviewSlice";

function BurntMenuExternalLink() {
  const burntListCount = useSelector(totalBurntCountSelector);
  const chain = useSelector(chainSelector);

  return (
    <Menu.Item key="Burnt">
      <ExternalLink href={`https://${chain}.subsquare.io/treasury/burnt`}>
        Burnt
        <IconMask
          src="/imgs/caret-up-right.svg"
          color="textSecondary"
          size={16}
        />
        <Label>{burntListCount}</Label>
      </ExternalLink>
    </Menu.Item>
  );
}

export default function BurntEntry() {
  if (isPolkadot || isKusama) {
    return <BurntMenuExternalLink />;
  }

  return null;
}
