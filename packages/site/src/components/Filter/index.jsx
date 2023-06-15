import React from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../../components/Select";
import Range from "../../components/Filter/Range";

const FormWrapper = styled(Form)`
  display: flex;
  gap: 16px;
  flex-grow: 1;
  align-items: center;

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }

  & .field {
    margin: 0 !important;
  }

  .ui.dropdown .text {
    font-size: 12px !important;
  }
`;

const StatusSelect = styled(Select)`
  width: 145px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--neutral300);
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 1px;
  }
`;

const Filter = ({
  chain,
  status,
  setStatus,
  rangeType,
  setRangeType,
  min,
  setMin,
  max,
  setMax,
  statusMap,
}) => {

  const statusOptions = [
    { key: "all", value: "-1", text: "All status" },
    ...Array.from(new Set(Object.values(statusMap))).map((key) => ({
      key,
      value: Object.entries(statusMap)
        .filter(([, v]) => v === key)
        .map(([k]) => k)
        .join("||"),
      text: key,
    })),
  ];

  return (
    <FormWrapper>
      <StatusSelect
        name="status"
        fluid
        options={statusOptions}
        value={status}
        onChange={(e, { name, value }) => setStatus(value)}
      />
      <Divider />
      <Range
        chain={chain}
        rangeType={rangeType}
        setRangeType={setRangeType}
        min={min}
        setMin={setMin}
        max={max}
        setMax={setMax}
      />
    </FormWrapper>
  );
};

export default Filter;
