import DetailGoBack from "../components/DetailGoBack";
import UserInfo from "./UserInfo";
import useEnsureCouncilorsCount from "./useEnsureCouncilorsCount";
import Councilor from "../UsersDetail/Councilor";
import Grade from "../UsersDetail/Councilor/Grade";

export default function CouncilorsDetail() {
  useEnsureCouncilorsCount();

  return (
    <div>
      <DetailGoBack backTo="/councilors" />
      <UserInfo />
      <Councilor />
      <Grade />
    </div>
  );
}
