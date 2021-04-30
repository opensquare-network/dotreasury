import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { totalTransferCountSelector } from "../../store/reducers/overviewSlice";

function TransfersMenu() {
  const transferCount = useSelector(totalTransferCountSelector);

  return (
    <Menu.Item key="Transfer">
      Transfers<Label>{transferCount}</Label>
    </Menu.Item>
  );
}

export default TransfersMenu;
