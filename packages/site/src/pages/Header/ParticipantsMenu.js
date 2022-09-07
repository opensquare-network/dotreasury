import { useSelector } from "react-redux";
import { Label, Menu } from "semantic-ui-react";
import { participantsSelector } from "../../store/reducers/participantsSlice";

export default function ParticipantsMenu() {
  const participants = useSelector(participantsSelector);

  return (
    <Menu.Item key="Participants">
      Participants<Label>{participants?.total ?? 0}</Label>
    </Menu.Item>
  );
}
