import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import IconMask from "../../components/Icon/Mask";
import { chainSelector } from "../../store/reducers/chainSlice";
import ExternalLink from "../../components/ExternalLink";
import { isPolkadot } from "../../utils/chains";
import { totalTipCountSelector } from "../../store/reducers/overviewSlice";

function TipsMenuExternalLink() {
  const tipsCount = useSelector(totalTipCountSelector);
  const chain = useSelector(chainSelector);

  return (
    <Menu.Item key="Tips">
      <ExternalLink href={`https://${chain}.subsquare.io/treasury/tips`}>
        Tips
        <IconMask
          src="/imgs/caret-up-right.svg"
          color="textSecondary"
          size={16}
        />
        <Label>{tipsCount}</Label>
      </ExternalLink>
    </Menu.Item>
  );
}

function TipsMenu() {
  const tipsCount = useSelector(totalTipCountSelector);

  return (
    <Menu.Item key="Tips">
      Tips<Label>{tipsCount}</Label>
    </Menu.Item>
  );
}

export default function TipsMenuWrapper() {
  if (isPolkadot) {
    return <TipsMenuExternalLink />;
  }

  return <TipsMenu />;
}
