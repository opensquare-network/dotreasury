// page `/:symbol/users/:address`
import { useParams } from "react-router";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";

export default function UsersDetail() {
  const { address } = useParams();

  return (
    <div>
      <DetailGoBack />

      <UserInfo />
    </div>
  );
}
