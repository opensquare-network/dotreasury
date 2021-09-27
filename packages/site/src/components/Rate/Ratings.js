import styled from "styled-components";

import Stars from "./Stars";
import Progress from "./Progress";
import { useDispatch, useSelector } from "react-redux";
import { fetchRateStats, rateStatsSelector } from "../../store/reducers/rateSlice";
import { useEffect } from "react";
import { chainSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.div`
  padding: 0 24px;
  flex: 0 0 381px;
  @media screen and (max-width: 800px) {
    flex-basis: auto;
  }
`;

const MainWrapper = styled.div`
  display: flex;
`;

const StarsWrapper = styled.div`
  flex: 0 0 auto;
  > :not(:first-child) {
    margin-top: 2px;
  }
`;

const ProgressWrapper = styled.div`
  flex: 1 1 auto;
  margin-left: 24px;
  > :not(:first-child) {
    margin-top: 2px;
  }
`;

const CountWrapper = styled.div`
  flex: 0 0 auto;
  margin-left: 16px;
  > * {
    display: block;
    font-size: 14px;
    line-height: 24px !important;
    color: rgba(0, 0, 0, 0.3);
    :not(:first-child) {
      margin-top: 2px;
    }
  }
`;

const Total = styled.div`
  margin-top: 22px;
  font-size: 13px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.65);
`;

export default function Ratings({ type, index }) {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);
  const rateStats = useSelector(rateStatsSelector);
  useEffect(() => {
    dispatch(fetchRateStats(chain, type, index));
  }, [dispatch, chain, type, index]);

  const [max, total] = (Object.values(rateStats) || []).reduce(
    (pre, cur) => {
      return [pre[0] < cur ? cur : pre[0], pre[1] + cur];
    },
    [1, 0]
  );

  return (
    <Wrapper>
      <MainWrapper>
        <StarsWrapper>
          {[...Array(5).keys()].map((item) => (
            <Stars key={item} rate={5 - item} />
          ))}
        </StarsWrapper>
        <ProgressWrapper>
          {[...Array(5).keys()].map((item) => (
            <Progress
              key={item}
              percent={(((rateStats || [])[5 - item] ?? 0) / max) * 100 + "%"}
            />
          ))}
        </ProgressWrapper>
        <CountWrapper>
          {[...Array(5).keys()].map((item) => (
            <div key={item}>{(rateStats || [])[5 - item] ?? 0}</div>
          ))}
        </CountWrapper>
      </MainWrapper>
      <Total>{total} Grades</Total>
    </Wrapper>
  );
}
