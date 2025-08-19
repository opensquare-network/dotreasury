import { noop } from "lodash";
import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import { TreasurySpendsTableOrigin } from "../../../pages/Spends/TreasurySpendsTable";
import ResponsivePagination from "../../../components/ResponsivePagination";
import { useUserTreasurySpendsData } from "../../../context/userTreasurySpends";

export default function SpendsTable({ header, footer = noop }) {
  const { data, loading, page, setPage, pageSize, setPageSize } =
    useUserTreasurySpendsData();

  const tableData = useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item) => ({
      ...item,
      proposeAtBlockHeight: item.indexer?.blockHeight,
      proposeTime: item.indexer?.blockTime,
      state: {
        name: item.state,
      },
    }));
  }, [data?.items]);

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handlePageChange = (_, { activePage }) => {
    setPage(activePage);
  };

  const footerComponent = (
    <>
      <ResponsivePagination
        activePage={page}
        pageSize={pageSize}
        totalPages={totalPages}
        setPageSize={handlePageSizeChange}
        onPageChange={handlePageChange}
      />
      {footer}
    </>
  );

  return (
    <TreasurySpendsTableOrigin
      data={tableData}
      loading={loading}
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
      footer={footerComponent}
      showFilter={false}
    />
  );
}
