import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import TipsTableOrigin from "../../Tips/TipsTable";
import UserTipsProvider, { useUserTipsData } from "../../../context/userTips";
import { normalizeTip } from "../../../store/reducers/tipSlice";
import { useParams } from "react-router";
import CommonFooter from "./commonFooter";

function TipsTableImpl({ header }) {
  const { data, loading, page, setPage, pageSize, setPageSize } =
    useUserTipsData();

  const tableData = useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item) =>
      normalizeTip({
        ...item,
        medianValue: item.onchainData.medianValue,
        symbolPrice: item?.onchainData?.price?.submission,
        latestState: {
          state: item?.state?.state,
          time: item?.onchainData?.state?.indexer?.blockTime,
        },
        tipsCount: item?.state?.tipsCount,
        hash: item.onchainData.hash,
        proposeAtBlockHeight: item.height,
        reason: item?.onchainData?.reason,
      }),
    );
  }, [data?.items]);

  return (
    <TipsTableOrigin
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

export default function TipsTable({ header }) {
  const { address } = useParams();

  return (
    <UserTipsProvider address={address}>
      <TipsTableImpl header={header} />
    </UserTipsProvider>
  );
}
