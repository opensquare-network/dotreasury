import styled from "styled-components";
import UsersTable from "./UsersTable";
import { h4_16_semibold } from "../../styles/text";
import ResponsivePagination from "../../components/ResponsivePagination";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  loadingSelector,
  usersSelector,
} from "../../store/reducers/usersSlice";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Divider from "../../components/Divider";
import Filter from "./Filter";
import useListFilter from "./useListFilters";

const Title = styled.div`
  ${h4_16_semibold};
  padding: 20px 24px;
  color: var(--textPrimary);
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px;
`;

export default function Participants() {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "projectsPageSize",
    DEFAULT_PAGE_SIZE,
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: tableData, total } = useSelector(usersSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  const { role, setRole, getFilterData } = useListFilter();

  useEffect(() => {
    const filterData = getFilterData();
    dispatch(fetchUsers(tablePage - 1, pageSize, filterData));
  }, [dispatch, tablePage, pageSize, getFilterData]);

  const header = (
    <div style={{ width: "100%" }}>
      <Title>Users</Title>
      <Divider />
      <FilterWrapper>
        <Filter role={role} setRole={setRole} />
      </FilterWrapper>
    </div>
  );

  return (
    <UsersTable
      userRole={role}
      data={tableData}
      loading={loading}
      header={header}
      footer={
        !!tableData?.length && (
          <ResponsivePagination
            activePage={tablePage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={(size) => {
              const searchParams = new URLSearchParams(history.location.search);
              searchParams.delete("page");
              history.push({ search: searchParams.toString() });

              setTablePage(DEFAULT_QUERY_PAGE);
              setPageSize(size);
            }}
            onPageChange={(_, { activePage }) => {
              const searchParams = new URLSearchParams(history.location.search);
              if (activePage === DEFAULT_QUERY_PAGE) {
                searchParams.delete("page");
              } else {
                searchParams.set("page", activePage);
              }
              history.push({ search: searchParams.toString() });

              setTablePage(activePage);
            }}
          />
        )
      }
    />
  );
}
