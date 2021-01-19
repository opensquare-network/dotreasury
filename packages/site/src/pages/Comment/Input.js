import React from "react";
import styled from "styled-components";
import { Form, Button } from "semantic-ui-react";

import TextArea from "../../components/TextArea"

const Wrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

const Input = () => {
  return (
    <>
      <Form>
        <TextArea
          placeholder="Please text here"
          rows={5}
        />
      </Form>
      <Wrapper>
        <Button primary disabled>Confirm</Button>
      </Wrapper>
    </>
  );
};

export default Input;
