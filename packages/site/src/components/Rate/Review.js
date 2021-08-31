import styled from "styled-components";
import ReviewItem from "./ReviewItem";
import Pagination from "../Pagination";

const Wrapper = styled.div``;

const TitleWrapper = styled.div`
  padding: 20px 24px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > :first-child {
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.9);
  }
  > :last-child {
    font-size: 13px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.65);
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  > * {
    margin: 0 auto;
  }
`;

export default function Review({ data }) {
  return (
    <Wrapper>
      <TitleWrapper>
        <div>Review</div>
        <div>{data?.length ?? 0} Reviews</div>
      </TitleWrapper>
      {(data || []).map((item, index) => (
        <ReviewItem key={index} data={item} />
      ))}
      <PaginationWrapper>
        <Pagination totalPages={10} />
      </PaginationWrapper>
    </Wrapper>
  );
}
