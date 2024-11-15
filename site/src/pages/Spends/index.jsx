import styled from "styled-components";
import TotalExpenditure from "./TotalExpenditure";

const Wrapper = styled.div`
  color: var(--textPrimary);
`;

export default function Spends() {
  return (
    <Wrapper>
      <TotalExpenditure />
    </Wrapper>
  );
}
