import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import IconMask from "../../components/Icon/Mask";
import { chainSelector } from "../../store/reducers/chainSlice";
import ExternalLink from "../../components/ExternalLink";
import { totalTipsCountSelector } from "../../store/reducers/overviewSummarySlice";

export default function TipsMenuWrapper() {
  const tipsCount = useSelector(totalTipsCountSelector);
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
