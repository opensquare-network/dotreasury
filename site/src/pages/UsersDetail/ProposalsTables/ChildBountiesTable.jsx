import { noop } from "lodash";
import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import BountiesTableOrigin from "../../Bounties/BountiesTable";
import ResponsivePagination from "../../../components/ResponsivePagination";
import { useUserChildBountiesData } from "../../../context/userChildBounties";
import { getBountyCurator } from "./BountiesTable";

export default function ChildBountiesTable({ header, footer = noop }) {
  const { data, loading, page, setPage, pageSize, setPageSize } =
    useUserChildBountiesData();

  const tableData = useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item) => ({
      ...item,
      proposeAtBlockHeight: item.indexer?.blockHeight,
      proposeTime: item.indexer?.blockTime,
      state: item?.onchainData?.state,
      value: item.onchainData.value,
      symbolPrice: item?.onchainData?.price?.submission,
      curator: getBountyCurator(item?.onchainData),
      parentBountyId: item?.onchainData?.parentBountyId,
      bountyIndex: item?.index,
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
    <BountiesTableOrigin
      data={tableData}
      loading={loading}
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
      footer={!!tableData.length && footerComponent}
      showFilter={false}
    />
  );
}
