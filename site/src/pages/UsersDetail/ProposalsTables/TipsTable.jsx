import { noop } from "lodash";
import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import TipsTableOrigin from "../../Tips/TipsTable";
import ResponsivePagination from "../../../components/ResponsivePagination";
import { useUserTipsData } from "../../../context/userTips";
import { normalizeTip } from "../../../store/reducers/tipSlice";

export default function TipsTable({ header, footer = noop }) {
  const { data, loading, page, setPage, pageSize, setPageSize } =
    useUserTipsData();

  const tableData = useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item) =>
      normalizeTip({
        ...item,
        reason: item.title,
        medianValue: item.onchainData.medianValue,
        symbolPrice: item?.onchainData?.price?.submission,
        latestState: {
          state: item?.state?.state,
          time: item?.onchainData?.indexer?.blockTime,
        },
        tipsCount: item?.state?.tipsCount,
        hash: item.onchainData.hash,
        proposeAtBlockHeight: item.height,
      }),
    );
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
    <TipsTableOrigin
      data={tableData}
      loading={loading}
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
      footer={!!tableData.length && footerComponent}
      showFilter={false}
    />
  );
}
