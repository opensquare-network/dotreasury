// page `/:symbol/users/:address`
import { useState } from "react";
import { USER_ROLES } from "../../constants";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";

export default function UsersDetail() {
  // FIXME: default should be Councilor or from api
  const [role, setRole] = useState(USER_ROLES.Beneficiary);

  return (
    <div>
      <DetailGoBack />

      <UserInfo role={role} setRole={setRole} />
    </div>
  );
}
