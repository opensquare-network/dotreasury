import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Form } from 'semantic-ui-react'
import { tipStatusMap } from "../../constants";

import Select from "../../components/Select";

const FormWrapper = styled(Form)`
  display: flex;
  justify-content: flex-end;
`;
const StatusSelect = styled(Select)`
  width: 200px;
`;

const statusMap = {};
for(let key in tipStatusMap) {
  if(statusMap[tipStatusMap[key]]) {
    statusMap[tipStatusMap[key]] = statusMap[tipStatusMap[key]] + '||' + key;
  }else {
    statusMap[tipStatusMap[key]] = key;
  }
}
const statusOptions = [
  { key: 'all', value: '-1', text: 'All status' }
];

for(let key in statusMap) {
  statusOptions.push({
    key, value: statusMap[key], text: key
  });
}

const Filter = ({ query }) => {
  const [status, setStatus] = useState('');

  // only query on filters change
  const mounting = useRef(true);
  useEffect(() => {
    if (mounting.current) {
      mounting.current = false;
      return;
    }
    const data = {
      status
    }
    for(let key in data) {
      if(data[key]==='' || data[key]==='-1') {
        delete data[key];
      }
    }
    query(data)
  }, [status, query]);

  return (
    <FormWrapper>
      <StatusSelect
        name="status"
        fluid
        options={statusOptions}
        defaultValue="-1"
        onChange={(e, {name,value})=>setStatus(value)}
      />
    </FormWrapper>
  );
};

export default Filter;
