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
import { useOutputPeriodsChartDatasets } from "../../../hooks/overview/usePeriodsChart";

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

const ChartOuterWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 178px;
  transform: translateY(-10px);
`;
const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 188px;
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
  const outputPeriodsDatasets =
    useOutputPeriodsChartDatasets(outputPeriodsLegends);

  const barHeights = outputPeriodsData.map((_, i) =>
    outputPeriodsDatasets.reduce((prev, curr) => prev + curr.data[i], 0),
  );
  const maxBarHeight = Math.max(...barHeights);
  const bgBarHeight = barHeights.map((h) => maxBarHeight - h);

  const bgDatasets = {
    label: "barBg",
    data: outputPeriodsData.map((_, i) => bgBarHeight[i]),
    backgroundColor: theme.neutral200,
    stack: "period",
  };

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
        <ChartOuterWrapper>
          <ChartWrapper>
            <IncomeAndOutputPeriodsChart
              outputPeriodsLegends={outputPeriodsLegends.filter(
                (i) => i.enabled,
              )}
              outputPeriodsData={outputPeriodsData}
              extraDatasets={[bgDatasets]}
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
              }}
            />
          </ChartWrapper>
        </ChartOuterWrapper>
      </ContentWrapper>
    </CardWrapper>
  );
}
