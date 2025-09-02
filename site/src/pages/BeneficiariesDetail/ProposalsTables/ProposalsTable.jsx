import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import ProposalsTableOrigin from "../../CentrifugeProposals/ProposalsTable";
import UserTreasuryProposalsProvider, {
  useUserTreasuryProposalsData,
} from "../../../context/userTreasuryProposals";
import { useParams } from "react-router";
import CommonFooter from "./commonFooter";
import convertProposals from "../../Proposals/convertProposals";

function ProposalsTableImpl({ header }) {
  const { data, loading, page, setPage, pageSize, setPageSize } =
    useUserTreasuryProposalsData();

  const tableData = useMemo(() => {
    if (!data?.items) return [];

    return convertProposals(data.items);
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

export default function ProposalsTable({ header }) {
  const { address } = useParams();

  return (
    <UserTreasuryProposalsProvider address={address}>
      <ProposalsTableImpl header={header} />
    </UserTreasuryProposalsProvider>
  );
}
