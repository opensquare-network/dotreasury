import styled from "styled-components";
import SkeletonBar from "../skeleton/bar";
import HistoryLineChart from "./HistoryLineChart";
import useTreasuryHistoryData from "./useTreasuryHistoryData";

const HistoricalLineChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // flex-shrink: 0;
  gap: 8px;
  height: 132px;
  width: 270px;
  @media screen and (max-width: 768px) {
    margin-top: 24px;
    width: 100%;
  }
`;

const ChartTitle = styled.div`
  color: rgba(27, 32, 44, 0.6);
  text-align: end;
  width: 100%;
  text-align: right;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
`;

const ChartWrapper = styled.div`
  weidth: 100%;
  flex: 1;
  overflow: hidden;
`;

export default function TreasuryHistoryLineChart() {
  const { data, loading } = useTreasuryHistoryData();

  return (
    <HistoricalLineChartWrapper>
      <ChartTitle>
        Treasury History($) <span>·</span> Last 30d
      </ChartTitle>
      <ChartWrapper>
        {loading ? (
          <SkeletonBar width={"100%"} height={"100%"} />
        ) : data ? (
          <HistoryLineChart {...data} />
        ) : (
          ""
        )}
      </ChartWrapper>
    </HistoricalLineChartWrapper>
  );
}
