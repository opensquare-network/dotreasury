import { Label, Menu } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  treasurySpendsCountSelector,
  fetchTreasurySpendsCount,
} from "../../store/reducers/treasurySpendsSlice";

export default function SpendsMenu() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTreasurySpendsCount());
  }, [dispatch]);

  const treasurySpendsCount = useSelector(treasurySpendsCountSelector);

  return (
    <Menu.Item key="Proposals">
      Spends<Label>{treasurySpendsCount}</Label>
    </Menu.Item>
  );
}
