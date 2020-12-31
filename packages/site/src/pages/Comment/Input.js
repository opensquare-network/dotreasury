import React from "react";
import styled from "styled-components";
import { Form, TextArea, Button } from "semantic-ui-react";

const Wrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

const CustomTextArea = styled(TextArea)`
  min-height: 100px;
  background: red;
`

const Input = () => {
  return (
    <>
      <Form>
        <CustomTextArea
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
