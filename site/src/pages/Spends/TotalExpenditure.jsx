import styled from "styled-components";
import CardOrigin from "../../components/Card";
import { h3_18_semibold } from "../../styles/text";
import ValueDisplay from "../../components/ValueDisplay";
import SummaryItem from "../../components/Summary/Item";

const Card = styled(CardOrigin)`
  padding: 24px;
`;

const ValueDisplayWrapper = styled.div`
  ${h3_18_semibold}
`;

export default function TotalExpenditure() {
  return (
    <Card>
      <SummaryItem
        title="Total Expenditure"
        content={
          <ValueDisplayWrapper>
            <ValueDisplay prefix="$" value={123333} />
          </ValueDisplayWrapper>
        }
      />
    </Card>
  );
}
