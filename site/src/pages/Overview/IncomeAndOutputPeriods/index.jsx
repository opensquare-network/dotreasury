import { useEffect } from "react";
import styled from "styled-components";
import Text from "../../../components/Text";
import Card from "../../../components/Card";
import { h4_16_semibold } from "../../../styles/text";
import IncomeAndOutputPeriodsChart from "./Chart";
import { useDispatch } from "react-redux";
import {
  fetchIncomePeriods,
  fetchSpendPeriods,
} from "../../../store/reducers/overviewSlice";
import IncomeAndSpendPeriodsLegend from "./Legend";
import {
  useIncomePeriodsLegends,
  useOutputPeriodsLegends,
} from "../../../hooks/overview/usePeriodsLegends";
import {
  useIncomePeriodsData,
  useOutputPeriodsData,
} from "../../../hooks/overview/usePeriodsData";

const Title = styled(Text)`
  margin-bottom: 16px;
  ${h4_16_semibold};
`;

const CardWrapper = styled(Card)`
  padding: 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  height: 168px;
  gap: 24px;
  margin-top: 8px;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const LegendWrapper = styled.div`
  margin-top: 16px;
`;

export default function IncomeAndOutputPeriods() {
  const dispatch = useDispatch();
  const [incomeLegends, setIncomeLegends] = useIncomePeriodsLegends();
  const [outputLegends, setOutputLegends] = useOutputPeriodsLegends();

  useEffect(() => {
    dispatch(fetchIncomePeriods());
    dispatch(fetchSpendPeriods());
  }, [dispatch]);

  const incomePeriodsData = useIncomePeriodsData();
  const outputPeriodsData = useOutputPeriodsData();

  return (
    <CardWrapper>
      <Title>Income & Output Periods</Title>
      <LegendWrapper>
        <IncomeAndSpendPeriodsLegend
          incomeLegends={incomeLegends}
          setIncomeLegends={setIncomeLegends}
          outputLegends={outputLegends}
          setOutputLegends={setOutputLegends}
        />
      </LegendWrapper>
      <ContentWrapper>
        <IncomeAndOutputPeriodsChart
          incomePeriodsLegends={incomeLegends.filter((item) => item.enabled)}
          incomePeriodsData={incomePeriodsData}
          outputPeriodsLegends={outputLegends.filter((item) => item.enabled)}
          outputPeriodsData={outputPeriodsData}
        />
      </ContentWrapper>
    </CardWrapper>
  );
}
