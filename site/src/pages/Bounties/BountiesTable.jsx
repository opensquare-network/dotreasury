import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import Card from "../../components/Card";
import { compatChildBountyData } from "../ChildBounties/utils";
import { useColumns } from "./columns";

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

export default function BountiesTable({ data, loading, header, footer }) {
  const history = useHistory();

  const { columns, getExternalLink } = useColumns();

  const onRowClick = (row) => {
    if (window.innerWidth < 1140) {
      const detailRoute = getExternalLink(row);
      history.push(detailRoute);
    }
  };

  return (
    <CardWrapper>
      {header}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            {data && (
              <Table
                treeDataTransform={compatChildBountyData}
                columns={columns}
                data={data}
                onRowClick={onRowClick}
              />
            )}
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
}
