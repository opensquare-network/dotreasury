import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalBountyCountSelector } from "../../store/reducers/overviewSlice";

function BountiesMenu() {
  const bountiesCount = useSelector(totalBountyCountSelector);

  return (
    <Menu.Item key="Bounties">
      Bounties<Label>{bountiesCount}</Label>
    </Menu.Item>
  );
}

export default BountiesMenu;
