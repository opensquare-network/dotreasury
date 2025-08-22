import { noop } from "lodash";
import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import ProposalsTableOrigin from "../../Proposals/ProposalsTable";
import ResponsivePagination from "../../../components/ResponsivePagination";
import UserTreasuryProposalsProvider, {
  useUserTreasuryProposalsData,
} from "../../../context/userTreasuryProposals";
import { useParams } from "react-router";

function ProposalsTableImpl({ header, footer = noop }) {
  const { data, loading, page, setPage, pageSize, setPageSize } =
    useUserTreasuryProposalsData();

  const tableData = useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item) => ({
      ...item,
      links: item?.links || [],
      latestState: {
        state: item?.state,
        time: item?.onchainData?.indexer?.blockTime,
      },
      proposeTime: item?.indexer?.blockTime,
      proposeAtBlockHeight: item?.indexer?.blockHeight,
      description: item?.title || "",
      trackInfo: item?.onchainData?.track,
      value: item?.onchainData?.value,
      symbolPrice: item?.onchainData?.price?.submission,
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
    <ProposalsTableOrigin
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
      loading={loading}
      data={tableData}
      footer={!!tableData.length && footerComponent}
    />
  );
}

export default function ProposalsTable({ header, footer = noop }) {
  const { address } = useParams();

  return (
    <UserTreasuryProposalsProvider address={address}>
      <ProposalsTableImpl header={header} footer={footer} />
    </UserTreasuryProposalsProvider>
  );
}
