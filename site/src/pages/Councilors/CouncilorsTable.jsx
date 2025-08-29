import styled from "styled-components";
import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import { colId, colAwardedValue } from "./TableColumns";
import { colBeneficiaryProposals as colCouncilorProposals } from "../Beneficiaries/TableColumns";

const Wrapper = styled.div`
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow: scroll;

  .proposal-councilor-header,
  .curator-header {
    cursor: pointer !important;
    color: var(--textSecondary) !important;
  }
`;

export default function CouncilorsTable({ data, loading }) {
  const columns = [colId, colCouncilorProposals, colAwardedValue];

  return (
    <Wrapper>
      <TableWrapper>
        <TableLoading loading={loading}>
          {data && <Table data={data} columns={columns} />}
        </TableLoading>
      </TableWrapper>
    </Wrapper>
  );
}
