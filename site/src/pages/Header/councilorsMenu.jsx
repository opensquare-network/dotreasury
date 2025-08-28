import { useSelector } from "react-redux";
import { Label, Menu } from "semantic-ui-react";
import { beneficiariesSelector } from "../../store/reducers/beneficiariesSlice";

export default function CouncilorsMenu() {
  const councilors = useSelector(beneficiariesSelector);

  return (
    <Menu.Item key="Councilors">
      Councilors<Label>{councilors?.total ?? 0}</Label>
    </Menu.Item>
  );
}
