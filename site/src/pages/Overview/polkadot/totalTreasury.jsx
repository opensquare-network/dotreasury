import styled from "styled-components";
import Card from "../../../components/Card";
import { h4_16_semibold } from "../../../styles/text";

const Wrapper = styled(Card)`
  padding: 24px;
`;

const Title = styled.h4`
  ${h4_16_semibold}
`;

const TokenGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

export default function OverviewTotalTreasury() {
  return (
    <Wrapper>
      <div>
        <Title>Total Treasury</Title>
        <div>price</div>
      </div>

      <TokenGroup>
        <div>item</div>
      </TokenGroup>
    </Wrapper>
  );
}
