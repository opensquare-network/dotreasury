import styled from "styled-components";
import dayjs from "dayjs";

import Stars from "./Stars";
import ThumbUp from "./ThumbUp";
import TimeElapsed from "../TimeElapsed";
import User from "../User";

const Wrapper = styled.div`
  padding: 16px 24px;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.9);
  & > :first-child {
    margin-right: 8px;
  }

`;

const TimeWrapper = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.3);
  margin-left: 16px;
`;

const RateWrapper = styled.div`
  margin-left: auto;
`;

const ContentWrapper = styled.div`
  margin: 8px 0 0 32px;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.9);
  word-wrap: break-word;
`;

const ThumbUpWrapper = styled.div`
  margin: 8px 0 0 32px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  & > :last-child {
    margin-left: 4px;
  }
`;

export default function ReviewItem({ rate }) {
  const data = rate.data;
  return (
    <Wrapper>
      <InfoWrapper>
        <AuthorWrapper>
          <User address={data.address} />
        </AuthorWrapper>
        <TimeWrapper>
          {dayjs().diff(dayjs(data.timestamp), "day") >= 1 ? (
            dayjs(data.timestamp).format("YYYY-MM-DD HH:mm:ss")
          ) : (
            <FlexWrapper>
              <TimeElapsed from={dayjs(data.timestamp).valueOf()} />
              <span>ago</span>
            </FlexWrapper>
          )}
        </TimeWrapper>
        <RateWrapper>
          <Stars rate={data.grade} />
        </RateWrapper>
      </InfoWrapper>
      <ContentWrapper>{data.comment}</ContentWrapper>
      <ThumbUpWrapper>
        <ThumbUp rate={rate} />
      </ThumbUpWrapper>
    </Wrapper>
  );
}
