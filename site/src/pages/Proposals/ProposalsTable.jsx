import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import Card from "../../components/Card";
import { useTableColumns } from "../../components/shared/useTableColumns";
import api from "../../services/scanApi";
import SortableIndex from "../../components/SortableIndex";
import SortableValue from "../../components/SortableValue";
import useSort from "../../hooks/useSort";
import { isKusama, isPolkadot } from "../../utils/chains";

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
  .proposal-proposer-header {
    cursor: pointer !important;
    color: var(--textSecondary) !important;
  }
`;

const completeProposalsWithTitle = (data = [], chain) => {
  return data.map(async (proposal) => {
    if (!proposal.description) {
      //improve: implement a brief API for this to speed up the loading
      const apiUrl = `https://${chain}.subsquare.io/api/treasury/proposals/${proposal.proposalIndex}`;
      const { result } = await api.fetch(apiUrl);
      return { ...proposal, description: result?.title };
    }
    return proposal;
  });
};

const ProposalsTable = ({ data, loading, header, footer }) => {
  const history = useHistory();
  const chain = useSelector(chainSelector);
  const [isBeneficiary, setIsBeneficiary] = useState(true);
  const [tableData, setTableData] = useState(data);

  const { sortField, setSortField, sortDirection, setSortDirection } =
    useSort();

  useEffect(() => {
    setTableData(data);

    Promise.all(completeProposalsWithTitle(data, chain)).then((res) => {
      setTableData(res);
    });
  }, [data, chain]);

  const onRowClick = (row) => {
    if (window.innerWidth < 1140) {
      history.push(getDetailRoute(row));
    }
  };

  const getRelatedLinks = (item) => {
    const links = [...item.links];
    if ([isKusama, isPolkadot].includes(chain)) {
      links.unshift({
        link: `https://${chain}.subsquare.io/treasury/proposal/${item.proposalIndex}`,
        description: "Treasury proposal page",
      });
    }
    return links;
  };
  const getDetailRoute = (row) => {
    return `/proposals/${row.proposalIndex}`;
  };

  let {
    proposalIndex,
    proposeTime,
    beneficiary,
    proposer,
    description,
    relatedLinks,
    value,
    proposalStatus,
    detailRoute,
  } = useTableColumns({
    getRelatedLinks,
    getDetailRoute,
  });

  const handleSwitchBebeficiaryProposer = () =>
    setIsBeneficiary(!isBeneficiary);
  beneficiary = {
    ...beneficiary,
    title: <span style={{ color: "var(--pink500)" }}>Beneficiary</span>,
    headerCellProps: {
      onClick: handleSwitchBebeficiaryProposer,
    },
  };
  proposer = {
    ...proposer,
    title: <span style={{ color: "var(--pink500)" }}>Proposer</span>,
    headerCellProps: {
      onClick: handleSwitchBebeficiaryProposer,
    },
  };
  beneficiary = {
    ...beneficiary,
    show: isBeneficiary,
  };
  proposer = {
    ...proposer,
    show: !isBeneficiary,
  };

  const sortByValue = {
    ...value,
    title: (
      <SortableValue
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
    ),
  };

  const sortableProposalIndex = {
    ...proposalIndex,
    title: (
      <SortableIndex
        direction={sortField === "index" ? sortDirection : ""}
        onClick={() => {
          setSortField("index");
          setSortDirection(
            sortField === "index" && sortDirection === "asc" ? "desc" : "asc",
          );
        }}
      />
    ),
  };

  const columns = [
    sortableProposalIndex,
    proposeTime,
    beneficiary,
    proposer,
    description,
    relatedLinks,
    sortByValue,
    proposalStatus,
    detailRoute,
  ];

  return (
    <CardWrapper>
      {header}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <Table columns={columns} data={tableData} onRowClick={onRowClick} />
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
};

export default ProposalsTable;
