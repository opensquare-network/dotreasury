import React from "react";
import styled from "styled-components";
import { Form, TextArea, Button } from "semantic-ui-react";

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
          style={{ minHeight: 100 }}
        />
      </Form>
      <Wrapper>
        <Button primary>Confirm</Button>
      </Wrapper>
    </>
  );
};

export default Input;
