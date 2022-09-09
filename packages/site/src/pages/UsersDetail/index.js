// page `/:symbol/users/:address`
import { useState } from "react";
import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";

export default function UsersDetail() {
  const [role, setRole] = useState("beneficiary");

  return (
    <div>
      <DetailGoBack />

      <UserInfo role={role} setRole={setRole} />
    </div>
  );
}
