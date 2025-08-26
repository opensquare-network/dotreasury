import { useMemo } from "react";
import { TableHeaderWrapper } from "./styled";
import { TreasurySpendsTableOrigin } from "../../Spends/TreasurySpendsTable";
import { useUserTreasurySpendsData } from "../../../context/userTreasurySpends";
import CommonFooter from "./commonFooter";

export default function SpendsTable({ header }) {
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

  return (
    <TreasurySpendsTableOrigin
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
