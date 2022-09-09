// page `/:symbol/users/:address`
import { useParams } from "react-router";
import DetailGoBack from "../components/DetailGoBack";

export default function UsersDetail() {
  const { address } = useParams();

  return (
    <div>
      <DetailGoBack />
    </div>
  );
}
