import styled from "styled-components";
import Card from "../../../components/Card";
import { p } from "../../../styles/tailwindcss";
import AssetsCell from "./AssetsCell";
import { HorizontalDivider, VerticalDivider } from "./common/styleds";
import BountiesCell from "./BountiesCell";
import FellowshipCell from "./FellowshipCell";
import LoansCell from "./LoansCell";
import HydrationCell from "./HydrationCell";
import MythCell from "./MythCell";

const Wrapper = styled(Card)`
  margin-bottom: 16px;
  ${p(24)};
`;

const Row = styled.div`
  display: flex;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function TreasuryDetail() {
  return (
    <Wrapper>
      <Column>
        <Row>
          <AssetsCell />
          <VerticalDivider />
          <BountiesCell />
          <VerticalDivider />
          <FellowshipCell />
        </Row>
        <HorizontalDivider />
        <Row>
          <LoansCell />
          <VerticalDivider />
          <HydrationCell />
          <VerticalDivider />
          <MythCell />
        </Row>
      </Column>
    </Wrapper>
  );
}
