import React from "react";
import { Table } from "../../components/Table";
import { useTableColumns } from "../../components/shared/useTableColumns";
import styled from "styled-components";
import Card from "../../components/Card";
import TableLoading from "../../components/TableLoading";
import Balance from "../../components/Balance";

const CardWrapper = styled(Card)`
  overflow-x: hidden;
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const Wrapper = styled.div`
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow: scroll;
`;

export default function GasFeeTable({ data, loading, header, footer }) {
  const { time, eventId } = useTableColumns();

  const columns = [
    time,
    eventId,
    {
      key: "balance",
      title: "Balance",
      headerCellProps: { textAlign: "right" },
      cellProps: { textAlign: "right" },
      cellRender(_, item) {
        return <Balance value={item.balance} />;
      },
    },
  ];

  return (
    <CardWrapper>
      {header}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <Table columns={columns} data={data} />
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
}
