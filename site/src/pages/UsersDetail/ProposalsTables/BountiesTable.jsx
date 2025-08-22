import { noop } from "lodash";
import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import BountiesTableOrigin from "../../Bounties/BountiesTable";
import ResponsivePagination from "../../../components/ResponsivePagination";
import UserBountiesProvider, {
  useUserBountiesData,
} from "../../../context/userBounties";
import { useParams } from "react-router";

export function getBountyCurator(onchainData) {
  const status = onchainData?.meta?.status;
  if (!status) {
    return null;
  }

  if (status?.active) {
    return status.active.curator.toString();
  }

  if (status?.pendingPayout) {
    return status.pendingPayout.curator.toString();
  }

  return null;
}

function BountiesTableImpl({ header, footer = noop }) {
  const { data, loading, page, setPage, pageSize, setPageSize } =
    useUserBountiesData();

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

export default function BountiesTable({ header, footer = noop }) {
  const { address } = useParams();

  return (
    <UserBountiesProvider address={address}>
      <BountiesTableImpl header={header} footer={footer} />
    </UserBountiesProvider>
  );
}
