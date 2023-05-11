import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";
import { tipStatusMap } from "../../constants";

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
  ...Array.from(new Set(Object.values(tipStatusMap))).map((key) => ({
    key,
    value: Object.entries(tipStatusMap)
      .filter(([, v]) => v === key)
      .map(([k]) => k)
      .join("||"),
    text: key,
  })),
];

const Filter = ({ value, query }) => {
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
        value={value}
        onChange={(e, { value }) => setStatus(value)}
      />
    </FormWrapper>
  );
};

export default Filter;
