import styled from "styled-components";
import Card from "../../../components/Card";
import { p } from "../../../styles/tailwindcss";
import AssetsCell from "./AssetsCell";

const Wrapper = styled(Card)`
  margin-bottom: 16px;
  ${p(24)};
`;

export default function TreasuryDetail() {
  return (
    <Wrapper>
      <AssetsCell />
    </Wrapper>
  );
}
