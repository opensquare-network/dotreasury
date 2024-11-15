import styled from "styled-components";
import Card from "../../../components/Card";
import Divider from "../../../components/Divider";
import TableHeader from "./table/header";
import Table from "./table";

const CardWrapper = styled(Card)`
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

export default function PolkadotReferendaTable() {
  return (
    <CardWrapper>
      <TableHeader />
      <Divider />
      <Table />
    </CardWrapper>
  );
}
