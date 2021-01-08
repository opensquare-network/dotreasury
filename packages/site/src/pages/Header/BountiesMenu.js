import React, { useEffect } from "react";
import { Menu, Label } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBountiesCount,
  bountiesCountSelector,
} from "../../store/reducers/bountySlice";

function BountiesMenu() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchBountiesCount())
  }, [dispatch])

  const bountiesCount = useSelector(bountiesCountSelector);

  return (
    <Menu.Item key="Bounties">
      Bounties<Label>{bountiesCount}</Label>
    </Menu.Item>
    );
}

export default BountiesMenu;
