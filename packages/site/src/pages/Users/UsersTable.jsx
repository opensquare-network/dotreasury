import styled from "styled-components";
import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import Card from "../../components/Card";
import { useTableColumns } from "./useTableColumns";

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

  .proposal-beneficiary-header,
  .curator-header {
    cursor: pointer !important;
    color: var(--textSecondary) !important;
  }
`;

export default function ParticipantsTable({ data, loading, header, footer }) {
  const { id, role, proposals } = useTableColumns();

  const columns = [id, role, proposals];

  return (
    <CardWrapper>
      {header}

      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            {data && <Table data={data} columns={columns} />}
          </TableLoading>
        </TableWrapper>
      </Wrapper>

      {footer}
    </CardWrapper>
  );
}
