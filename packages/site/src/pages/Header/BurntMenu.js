import React from "react";
import { Menu, Label } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalBurntCountSelector } from "../../store/reducers/overviewSlice";

function BurntMenu() {
  const burntListCount = useSelector(totalBurntCountSelector);

  return (
    <Menu.Item key="Burnt">
      Burnt<Label>{burntListCount}</Label>
    </Menu.Item>
  );
}

export default BurntMenu;
