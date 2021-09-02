import styled from "styled-components";

import Stars from "./Stars";
import ThumbUp from "./ThumbUp";

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
  > img {
    width: 24px;
    height: 24px;
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

export default function ReviewItem({ data }) {
  return (
    <Wrapper>
      <InfoWrapper>
        <AuthorWrapper>
          <img src="/imgs/avatar.png" alt="" />
          {data.author}
        </AuthorWrapper>
        <TimeWrapper>{data.time}</TimeWrapper>
        <RateWrapper>
          <Stars rate={data.rate} />
        </RateWrapper>
      </InfoWrapper>
      <ContentWrapper>{data.content}</ContentWrapper>
      <ThumbUpWrapper>
        <ThumbUp />
      </ThumbUpWrapper>
    </Wrapper>
  );
}
