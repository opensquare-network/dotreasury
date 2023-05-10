import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../../components/Select";

const FormWrapper = styled(Form)`
  display: flex;
  justify-content: flex-end;
`;
const StatusSelect = styled(Select)`
  width: 145px;
`;

const statusOptions = [
  { key: "all", value: "-1", text: "All status" },
  ...[
    "Awarded",
    "Proposed",
    "Approved",
    "Rejected",
    "ApproveVoting",
    "RejectVoting",
  ].map((item) => ({
    key: item,
    value: item,
    text: item,
  })),
];

const Filter = ({ query }) => {
  const [status, setStatus] = useState("");

  // only query on filters change
  const mounting = useRef(true);
  useEffect(() => {
    if (mounting.current) {
      mounting.current = false;
      return;
    }
    const data = {
      status,
    };
    for (let key in data) {
      if (data[key] === "" || data[key] === "-1") {
        delete data[key];
      }
    }
    query(data);
  }, [status, query]);

  return (
    <FormWrapper>
      <StatusSelect
        name="status"
        fluid
        options={statusOptions}
        defaultValue="-1"
        onChange={(e, { name, value }) => setStatus(value)}
      />
    </FormWrapper>
  );
};

export default Filter;
