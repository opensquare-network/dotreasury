import styled from "styled-components";
import Card from "../../components/Card";
import { h4_16_semibold } from "../../styles/text";

const Title = styled.div`
  ${h4_16_semibold};
  padding: 20px 24px;
  color: var(--textPrimary);
`;

const CardWrapper = styled(Card)`
  overflow-x: hidden;
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

export default function Councilors() {
  return (
    <CardWrapper>
      <div style={{ width: "100%" }}>
        <Title>Councilors</Title>
      </div>
      Councilors table
    </CardWrapper>
  );
}
