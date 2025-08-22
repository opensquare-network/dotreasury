import { noop } from "lodash";
import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import ProposalsTableOrigin from "../../Proposals/ProposalsTable";
import UserTreasuryProposalsProvider, {
  useUserTreasuryProposalsData,
} from "../../../context/userTreasuryProposals";
import { useParams } from "react-router";
import CommonFooter from "./commonFooter";

function ProposalsTableImpl({ header }) {
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

  return (
    <ProposalsTableOrigin
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
      loading={loading}
      data={tableData}
      footer={
        !!tableData.length && (
          <CommonFooter
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            total={data?.total || 0}
          />
        )
      }
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
