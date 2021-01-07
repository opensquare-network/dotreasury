import React from "react";
import { Table } from "semantic-ui-react";

const TableNoDataCell = () => {
  return (
    <Table.Row>
      <Table.Cell className="no-data" colSpan="99" textAlign="center">
        No data
      </Table.Cell>
    </Table.Row>
  )
}

export default TableNoDataCell;
