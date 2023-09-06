import React from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TextMinor from "../../components/TextMinor";
import Card from "../../components/Card";
import { useColumns } from "../Bounties/columns";

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

const ChildBountiesTable = ({
  data,
  loading,
  header,
  footer,
  showParent = true,
}) => {
  const history = useHistory();

  const { columns, getDetailRoute } = useColumns({ defaultCurator: false });

  const onRowClick = (row) => {
    if (window.innerWidth < 1140) {
      const detailRoute = getDetailRoute(row);
      history.push(detailRoute);
    }
  };

  if (showParent) {
    // next to `index`
    columns.splice(1, 0, {
      key: "parent",
      title: "Parent",
      dataIndex: "parentBountyId",
      // cellProps: "index-cell", // todo: check why this cause an error
      cellClassName: "index-cell",
      cellRender: (value) => (
        <NavLink to={`./bounties/${value}`} key={value}>
          <TextMinor>{`#${value}`}</TextMinor>
        </NavLink>
      ),
    });
  }

  return (
    <CardWrapper>
      {header}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <Table columns={columns} data={data} onRowClick={onRowClick} />
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
};

export default ChildBountiesTable;
