import styled from "styled-components";

import Card from "../Card";
import Ratings from "./Ratings";
import MyRating from "./MyRating";
import Review from "./Review";

import { RATE } from "../../constants";

const Wrapper = styled(Card)`
  padding: 0;
`;

const TitleWrapper = styled.div`
  padding: 20px 24px;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
`;

const UpWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const UpDivider = styled.div`
  width: 1px;
  background: #f4f4f4;
  @media screen and (max-width: 800px) {
    width: auto;
    height: 1px;
    margin: 16px 0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f4f4f4;
`;

export default function Rate({ type, index }) {
  return (
    <Wrapper>
      <TitleWrapper>Rate</TitleWrapper>
      <UpWrapper>
        <Ratings data={RATE.ratings} />
        <UpDivider />
        <MyRating type={type} index={index} />
      </UpWrapper>
      <Divider />
      <Review data={RATE.reviews} />
    </Wrapper>
  );
}
