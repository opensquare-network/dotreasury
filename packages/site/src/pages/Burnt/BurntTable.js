import React from "react";
import styled from "styled-components";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import Card from "../../components/Card";
import Burnt from "../../components/Charts/burnt";
import { useTableColumns } from "../../components/shared/useTableColumns";

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

const BurntTable = ({ data, chartData, loading, footer }) => {
  const symbol = useSelector(chainSymbolSelector);
  const { time, eventId, value, per, remnant } = useTableColumns();
  const columns = [time, eventId, value, per, remnant];

  return (
    <CardWrapper>
      <Burnt symbol={symbol} chartData={chartData} />
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <Table
              columns={columns}
              data={data}
              colgroup={
                <colgroup>
                  <col span="1" style={{ width: "25%" }} />
                  <col span="1" style={{ width: "15%" }} />
                  <col span="1" />
                  <col span="1" style={{ width: "10%" }} />
                  <col span="1" style={{ width: "20%" }} />
                </colgroup>
              }
            />
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
};

export default BurntTable;
