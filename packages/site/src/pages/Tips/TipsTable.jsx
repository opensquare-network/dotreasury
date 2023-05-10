import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import { useSelector } from "react-redux";
import {
  chainSelector,
  chainSymbolSelector,
} from "../../store/reducers/chainSlice";
import Card from "../../components/Card";
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

const TipsTable = ({ data, loading, header, footer }) => {
  const history = useHistory();
  const chain = useSelector(chainSelector);
  const symbol = useSelector(chainSymbolSelector);

  const getRelatedLinks = (item) => {
    const links = [];
    if (["kusama", "polkadot"].includes(chain)) {
      links.unshift({
        link: `https://${chain}.polkassembly.io/tip/${item.hash}`,
        description: "Treasury tip page",
      });
      links.unshift({
        link: `https://${chain}.subsquare.io/treasury/tip/${item.proposeAtBlockHeight}_${item.hash}`,
        description: "Treasury tip page",
      });
    }
    return links;
  };
  const getDetailRoute = (row) => {
    return `/${symbol.toLowerCase()}/tips/${row.proposeAtBlockHeight}_${
      row.hash
    }`;
  };

  const onRowClick = (row) => {
    if (window.innerWidth < 1140) {
      history.push(getDetailRoute(row));
    }
  };

  const {
    tipsBeneficiary,
    finder,
    reason,
    tipsValue,
    tipsStatus,
    detailRoute,
    relatedLinks,
  } = useTableColumns({ getRelatedLinks, getDetailRoute, compact: true });
  const columns = [
    tipsBeneficiary,
    finder,
    reason,
    relatedLinks,
    tipsValue,
    tipsStatus,
    detailRoute,
  ];

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

export default TipsTable;
