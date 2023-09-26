import { Label } from "semantic-ui-react";
import styled from "styled-components";
import ChildBountiesTable from "../ChildBounties/ChildBountiesTable";
import Pagination from "../Bounties/Pagination";
import { useLocalStorage } from "../../utils/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchChildBountiesByParentIndex,
  childBountyByParentIndexListSelector,
  loadingSelector,
} from "../../store/reducers/bountySlice";
import { compatChildBountyData } from "../ChildBounties/utils";
import { DEFAULT_PAGE_SIZE } from "../../constants";
import { Flex } from "../../components/styled";
import NewChildBountyButton from "./NewChildBountyButton";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import useWaitSyncBlock from "../../utils/useWaitSyncBlock";

const Wrapper = styled.div`
  margin-top: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: var(--textPrimary);
  padding: 20px 24px;

  div.ui.label {
    background: var(--secondary) !important;
    height: 20px !important;
    padding: 0 8px !important;
    line-height: 20px !important;
    border-radius: 10px !important;
    margin-left: 8px !important;
    color: var(--primary) !important;
    font-weight: 400;
  }
`;

function ChildTable({ index }) {
  const dispatch = useDispatch();

  const [tablePage, setTablePage] = useState(1);
  const [pageSize, setPageSize] = useLocalStorage(
    "bountiesDetailChildBountiesPageSize",
    DEFAULT_PAGE_SIZE,
  );

  const { items: childBounties, total } = useSelector(
    childBountyByParentIndexListSelector,
  );
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchChildBountiesByParentIndex(index, tablePage - 1, pageSize));
  }, [dispatch, index, tablePage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const tableData = useMemo(() => {
    return childBounties.map(compatChildBountyData);
  }, [childBounties]);

  const refreshChildBounties = useCallback(
    (reachingFinalizedBlock) => {
      dispatch(fetchChildBountiesByParentIndex(index, tablePage - 1, pageSize));
      if (reachingFinalizedBlock) {
        dispatch(
          newSuccessToast(
            "Sync finished. Please provide context info for your child bounty on subsquare or polkassembly.",
          ),
        );
      }
    },
    [dispatch, index, tablePage, pageSize],
  );

  const onFinalized = useWaitSyncBlock(
    "Child bounty created",
    refreshChildBounties,
  );

  const header = (
    <Header>
      <Flex>
        <span>Child Bounties</span>
        <Label>{total}</Label>
      </Flex>
      <div style={{ display: "flex", gap: "16px" }}>
        <NewChildBountyButton
          parentBountyId={index}
          onFinalized={onFinalized}
        />
      </div>
    </Header>
  );

  const footer = (
    <Pagination
      page={tablePage}
      setPage={setTablePage}
      totalPages={totalPages}
      pageSize={pageSize}
      setPageSize={setPageSize}
      persist={false}
    />
  );

  return (
    <Wrapper>
      <ChildBountiesTable
        showParent={false}
        loading={loading}
        data={tableData}
        header={header}
        footer={footer}
      />
    </Wrapper>
  );
}

export default ChildTable;
