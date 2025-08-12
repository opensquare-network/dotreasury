import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import BeneficiariesTable from "./BeneficiariesTable";
import { h4_16_semibold } from "../../styles/text";
import ResponsivePagination from "../../components/ResponsivePagination";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import {
  beneficiariesSelector,
  fetchBeneficiaries,
  loadingSelector,
} from "../../store/reducers/beneficiariesSlice";

const Title = styled.div`
  ${h4_16_semibold};
  padding: 20px 24px;
  color: var(--textPrimary);
`;

export default function Beneficiaries() {
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
  const { items: tableData, total } = useSelector(beneficiariesSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete("page");
    history.push({ search: searchParams.toString() });

    setTablePage(DEFAULT_QUERY_PAGE);
  }, [history]);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(
      fetchBeneficiaries(
        tablePage,
        pageSize,
        {},
        {
          signal: controller.signal,
        },
      ),
    );

    return () => {
      controller.abort();
    };
  }, [dispatch, tablePage, pageSize]);

  const header = (
    <div style={{ width: "100%" }}>
      <Title>Beneficiaries</Title>
    </div>
  );

  return (
    <BeneficiariesTable
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
