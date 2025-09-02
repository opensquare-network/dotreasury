import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import { proposalStatusMap } from "../../constants";
import OpenGovFilter from "../../components/OpenGovFilter";

const FilterWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px;
`;

export default function TableFilter({
  filterStatus,
  setFilterStatus,
  filterTrack,
  setFilterTrack,
}) {
  const chain = useSelector(chainSelector);

  return (
    <FilterWrapper>
      <OpenGovFilter
        chain={chain}
        status={filterStatus}
        setStatus={setFilterStatus}
        track={filterTrack}
        setTrack={setFilterTrack}
        statusMap={proposalStatusMap}
        showRange={false}
      />
    </FilterWrapper>
  );
}
