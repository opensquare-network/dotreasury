import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import BountiesTableOrigin from "../../Bounties/BountiesTable";
import UserBountiesProvider, {
  useUserBountiesData,
} from "../../../context/userBounties";
import { useParams } from "react-router";
import CommonFooter from "./commonFooter";

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

function BountiesTableImpl({ header }) {
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

  return (
    <BountiesTableOrigin
      data={tableData}
      loading={loading}
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
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
      showFilter={false}
    />
  );
}

export default function BountiesTable({ header }) {
  const { address } = useParams();

  return (
    <UserBountiesProvider address={address}>
      <BountiesTableImpl header={header} />
    </UserBountiesProvider>
  );
}
