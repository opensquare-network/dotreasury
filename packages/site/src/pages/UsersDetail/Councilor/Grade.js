import { useParams } from "react-router";
import Rate from "../../../components/Rate";

export default function Grade() {
  const { address } = useParams();

  return <Rate type="councilor" index={address} />;
}
