import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Form } from 'semantic-ui-react'

import { Select } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'

const FormWrapper = styled(Form)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;
const ButtonsWrapper = styled.div`
  margin-left: 20px;
`;
const StatusSelect = styled(Form.Select)`
  width: 200px;
`;

const statusOptions = [
  { key: 'closed', value: 'closed', text: 'Closed' },
  { key: 'tipping', value: 'tipping', text: 'Tipping' },
  { key: 'retracted', value: 'retracted', text: 'Retracted' },
]
const Filter = ({ query }) => {
  const [status, setStatus] = useState('');

  const handleSubmit = () => {
    const data = {
      status
    }
    for(let key in data) {
      if(data[key]==='') {
        delete data[key];
      }
    }
    query(data)
  }
  return (
    <FormWrapper onSubmit={handleSubmit}>
      <StatusSelect
        name="status"
        fluid
        options={statusOptions}
        clearable
        onChange={(e, {name,value})=>setStatus(value)}
      />
      <ButtonsWrapper>
        <Button type="submit" primary>query</Button>
        {/* <Button secondary>clear</Button> */}
      </ButtonsWrapper>
    </FormWrapper>
  );
};

export default Filter;
