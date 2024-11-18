import { Label, Menu } from "semantic-ui-react";
import { totalSpendsCountSelector } from "../../store/reducers/overviewSlice";
import { useSelector } from "react-redux";

export default function SpendsMenu() {
  const treasurySpendsCount = useSelector(totalSpendsCountSelector);

  return (
    <Menu.Item key="Proposals">
      Spends<Label>{treasurySpendsCount}</Label>
    </Menu.Item>
  );
}
