import React from "react";

import { Table } from "../../components/Table";
import { useTableColumns } from "../../components/shared/useTableColumns";

export default function GasFeeTable() {
  const { time, eventId } = useTableColumns();

  const columns = [
    time,
    eventId,
    {
      key: "balance",
      title: "Balance",
      headerCellProps: { textAlign: "right" },
      cellProps: { textAlign: "right" },
      cellRender(_, data) {
        return <div>1</div>;
      },
    },
  ];

  return <Table columns={columns} />;
}
