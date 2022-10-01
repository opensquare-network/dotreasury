import { useParams } from "react-router";
import Rate from "../../../components/Rate";
import styled from "styled-components";

const MarginWrapper = styled.div`
  margin-top: 24px;
`

export default function Grade() {
  const { address } = useParams();

  return <MarginWrapper>
    <Rate type="user" index={ address } />
  </MarginWrapper>

}
