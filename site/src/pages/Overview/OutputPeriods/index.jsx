import styled from "styled-components";
import { h4_16_semibold } from "../../../styles/text";
import Text from "../../../components/Text";
import Card from "../../../components/Card";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpendPeriods } from "../../../store/reducers/overviewSlice";
import { useOutputSinglePeriodsLegends } from "../../../hooks/overview/usePeriodsLegends";
import OutputPeriodsLegend from "./Legend";
import IncomeAndOutputPeriodsChart from "../IncomeAndOutputPeriods/Chart";
import { useOutputPeriodsData } from "../../../hooks/overview/usePeriodsData";
import { useTheme } from "../../../context/theme";
import { backgroundBarPlugin } from "../../../utils/chartjs/backgroundBarPlugin";

const CardWrapper = styled(Card)`
  margin-top: 16px;
  padding: 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 24px;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 178px;
  overflow-x: auto;
`;

const Title = styled(Text)`
  margin-bottom: 16px;
  ${h4_16_semibold};
`;

export default function OutputPeriods() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [outputPeriodsLegends, setOutputPeriodsLegends] =
    useOutputSinglePeriodsLegends();
  const outputPeriodsData = useOutputPeriodsData();

  useEffect(() => {
    dispatch(fetchSpendPeriods());
  }, [dispatch]);

  return (
    <CardWrapper>
      <Title>Output Periods</Title>
      <ContentWrapper>
        <OutputPeriodsLegend
          legends={outputPeriodsLegends}
          setLegends={setOutputPeriodsLegends}
        />
        <ChartWrapper>
          <IncomeAndOutputPeriodsChart
            outputPeriodsLegends={outputPeriodsLegends.filter((i) => i.enabled)}
            outputPeriodsData={outputPeriodsData}
            options={{
              scales: {
                y: {
                  suggestedMin: null,
                  suggestedMax: null,
                  ticks: {
                    display: false,
                  },
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                backgroundBar: {
                  backgroundColor: theme.neutral200,
                },
              },
            }}
            plugins={[backgroundBarPlugin]}
          />
        </ChartWrapper>
      </ContentWrapper>
    </CardWrapper>
  );
}
