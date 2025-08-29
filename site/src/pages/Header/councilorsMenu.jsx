import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { councilorsSelector } from "../../store/reducers/councilorsSlice";
import useEnsureCouncilorsCount from "../CouncilorsDetail/useEnsureCouncilorsCount";

export default function CouncilorsMenu() {
  useEnsureCouncilorsCount();
  const councilors = useSelector(councilorsSelector);

  return (
    <Menu.Item key="Councilors">
      Councilors<Label>{councilors?.total ?? 0}</Label>
    </Menu.Item>
  );
}
