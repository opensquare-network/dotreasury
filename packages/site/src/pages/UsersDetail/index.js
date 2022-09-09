// page `/:symbol/users/:address`
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";

export default function UsersDetail() {
  return (
    <div>
      <DetailGoBack />

      <UserInfo />
    </div>
  );
}
