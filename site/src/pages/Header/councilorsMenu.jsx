import { Label, Menu } from "semantic-ui-react";
import { usersSelector } from "../../store/reducers/usersSlice";
import { useSelector } from "react-redux";
import useEnsureCouncilorsCount from "../CouncilorsDetail/useEnsureCouncilorsCount";

export default function CouncilorsMenu() {
  useEnsureCouncilorsCount();
  const councilors = useSelector(usersSelector);

  return (
    <Menu.Item key="Councilors">
      Councilors<Label>{councilors?.total ?? 0}</Label>
    </Menu.Item>
  );
}
