import { useSelector } from "react-redux";
import { Label, Menu } from "semantic-ui-react";
import { usersSelector } from "../../store/reducers/usersSlice";

export default function UsersMenu() {
  const users = useSelector(usersSelector);

  return (
    <Menu.Item key="Users">
      Users<Label>{users?.total ?? 0}</Label>
    </Menu.Item>
  );
}
