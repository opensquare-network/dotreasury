import styled from "styled-components";
import ReviewItem from "./ReviewItem";
import Pagination from "../../pages/Comment/ResponsivePagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRates,
  ratesSelector,
  rateStatsSelector,
} from "../../store/reducers/rateSlice";
import { useEffect, useState } from "react";
import { loggedInUserSelector } from "../../store/reducers/userSlice";

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
    color: var(--textPrimary);
  }
  > :last-child {
    font-size: 13px;
    line-height: 18px;
    color: var(--textSecondary);
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  > * {
    margin: 0 auto;
  }
`;

const DEFAULT_PAGE_SIZE = 10;

export default function Review({ type, index }) {
  const dispatch = useDispatch();
  const rates = useSelector(ratesSelector);
  const rateStats = useSelector(rateStatsSelector);
  const [page, setPage] = useState(0);
  const loggedInUser = useSelector(loggedInUserSelector);
  const loggedIn = !!loggedInUser;

  const totalPages = Math.ceil(rates.total / DEFAULT_PAGE_SIZE);

  useEffect(() => {
    dispatch(fetchRates(type, index, page, DEFAULT_PAGE_SIZE));
  }, [dispatch, type, index, page, rateStats, loggedIn]);

  const pageChange = (_, { activePage }) => {
    setPage(activePage - 1);
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <div>Review</div>
        <div>{rates?.total ?? 0} Reviews</div>
      </TitleWrapper>
      {(rates.items || []).map((item, index) => (
        <ReviewItem key={index} rate={item} />
      ))}
      <PaginationWrapper>
        <Pagination
          activePage={rates.page + 1}
          totalPages={totalPages}
          onPageChange={pageChange}
        />
      </PaginationWrapper>
    </Wrapper>
  );
}
