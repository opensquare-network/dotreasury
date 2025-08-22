import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import ChildBountiesTableOrigin from "../../ChildBounties/ChildBountiesTable";
import UserChildBountiesProvider, {
  useUserChildBountiesData,
} from "../../../context/userChildBounties";
import { getBountyCurator } from "./BountiesTable";
import { useParams } from "react-router";
import CommonFooter from "./commonFooter";

function ChildBountiesTableImpl({ header }) {
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

  return (
    <ChildBountiesTableOrigin
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

export default function ChildBountiesTable({ header }) {
  const { address } = useParams();

  return (
    <UserChildBountiesProvider address={address}>
      <ChildBountiesTableImpl header={header} />
    </UserChildBountiesProvider>
  );
}
