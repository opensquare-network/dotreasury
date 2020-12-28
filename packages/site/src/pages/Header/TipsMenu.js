import React, { useEffect } from "react";
import { Menu, Label } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTipsCount,
  tipsCountSelector,
} from "../../store/reducers/tipSlice";

function TipsMenu() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchTipsCount())
  }, [dispatch])

  const tipsCount = useSelector(tipsCountSelector);

  return (
    <Menu.Item key="Tips">
      Tips<Label>{tipsCount}</Label>
    </Menu.Item>
    );
}

export default TipsMenu;
