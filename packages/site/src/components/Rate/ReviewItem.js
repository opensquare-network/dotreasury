import styled from "styled-components";
import dayjs from "dayjs";

import Stars from "./Stars";
import IpfsData from "./IpfsData";
import TimeElapsed from "../TimeElapsed";
import User from "../User";

const Wrapper = styled.div`
  padding: 16px 24px;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 640px) {
    margin-bottom: 26px;
  }
`;

const AuthorWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.9);
`;

const TimeWrapper = styled.div`
  @media screen and (max-width: 640px) {
    position: absolute;
    top: 22px;
    left: 34px;
    font-size: 12px;
  }
  @media screen and (min-width: 640px) {
    margin-left: 16px;
    font-size: 14px;
  }

  line-height: 22px;
  color: rgba(0, 0, 0, 0.3);
  white-space: nowrap;
`;

const RateWrapper = styled.div`
  margin-left: auto;
`;

const IpfsWrapper = styled.div`
  margin-left: 12px;
`;

const ContentWrapper = styled.div`
  margin: 8px 0 0 32px;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.9);
  word-wrap: break-word;
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
          <User address={rate.address} />
          <TimeWrapper>
            {dayjs().diff(dayjs(data.timestamp*1000), "day") >= 1 ? (
              dayjs(data.timestamp*1000).format("YYYY-MM-DD")
            ) : (
              <FlexWrapper>
                <TimeElapsed from={dayjs(data.timestamp*1000).valueOf()} />
                <span>ago</span>
              </FlexWrapper>
            )}
          </TimeWrapper>
        </AuthorWrapper>
        <RateWrapper>
          <Stars rate={data.grade} />
        </RateWrapper>
        <IpfsWrapper>
          <IpfsData url={rate.pinHash && `${rate.ipfsEndpoint}/${rate.pinHash}`} />
        </IpfsWrapper>
      </InfoWrapper>
      <ContentWrapper>{data.comment}</ContentWrapper>
    </Wrapper>
  );
}
