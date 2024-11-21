import styled from "styled-components";
import CardOrigin from "../../components/Card";
import { h3_18_semibold } from "../../styles/text";
import ValueDisplay from "../../components/ValueDisplay";
import SummaryItem from "../../components/Summary/Item";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTreasurySpendsTotalExpenditure,
  loadingTotalExpenditureSelector,
  totalExpenditureSelector,
} from "../../store/reducers/treasurySpendsSlice";
import SkeletonBar from "../../components/skeleton/bar";

const Card = styled(CardOrigin)`
  padding: 24px;
`;

const ValueDisplayWrapper = styled.div`
  ${h3_18_semibold}
`;

export default function TotalExpenditure() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTreasurySpendsTotalExpenditure());
  }, [dispatch]);

  const totalExpenditure = useSelector(totalExpenditureSelector);
  const loadingTotalExpenditure = useSelector(loadingTotalExpenditureSelector);

  return (
    <Card>
      <SummaryItem
        title="Total Expenditure"
        content={
          <ValueDisplayWrapper>
            {loadingTotalExpenditure ? (
              <SkeletonBar width={114} height={28} />
            ) : (
              <ValueDisplay prefix="$" value={totalExpenditure} />
            )}
          </ValueDisplayWrapper>
        }
      />
    </Card>
  );
}
