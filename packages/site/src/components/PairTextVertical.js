import React from "react";
import styled from "styled-components";

import Text from "./Text";
import TextMinor from "./TextMinor";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  p {
    white-space: nowrap;
  }
  p:last-child {
    font-size: 12px;
  }
`;

const Status = ({ value, detail }) => {
  return (
    <Wrapper>
      <Text>{value}</Text>
      <TextMinor>{detail}</TextMinor>
    </Wrapper>
  );
};

export default Status;
