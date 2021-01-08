import React, { useEffect } from "react";
import { Menu, Label } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBurntListCount,
  burntListCountSelector,
} from "../../store/reducers/burntSlice";

function BurntMenu() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchBurntListCount())
  }, [dispatch])

  const burntListCount = useSelector(burntListCountSelector);

  return (
    <Menu.Item key="Burnt">
      Burnt<Label>{burntListCount}</Label>
    </Menu.Item>
    );
}

export default BurntMenu;
