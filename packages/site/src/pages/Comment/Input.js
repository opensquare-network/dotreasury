import React from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import MarkdownEditor from "../../components/MarkdownEditor";

const Wrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

const Input = () => {
  return (
    <>
      <MarkdownEditor />
      <Wrapper>
        <Button primary disabled>Confirm</Button>
      </Wrapper>
    </>
  );
};

export default Input;
