import React from "react";
import Table from "../../components/Table";

const TipsTable = () => {
  return (
    <Table striped selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign={"center"}>Beneficiary</Table.HeaderCell>
          <Table.HeaderCell textAlign={"center"}>Finder</Table.HeaderCell>
          <Table.HeaderCell>Reason</Table.HeaderCell>
          <Table.HeaderCell textAlign={"right"}>Value</Table.HeaderCell>
          <Table.HeaderCell textAlign={"right"}>Status</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>FtvpME…nZXKLg</Table.Cell>
          <Table.Cell>DbJSgP…tbQ66r</Table.Cell>
          <Table.Cell>https://kusama.polkassembly.io/post/346</Table.Cell>
          <Table.Cell textAlign={"right"}>50.00 KSM</Table.Cell>
          <Table.Cell textAlign={"right"}>Tipping (2)</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default TipsTable;
