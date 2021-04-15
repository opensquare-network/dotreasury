import React from "react";
import styled from "styled-components";
import TextMinor from "../../components/TextMinor";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  background: #fbfbfb;
  border-radius: 8px;
  margin-top: 12px;
  p {
    margin-bottom: 10px;
  }
`;

const NoAddress = () => {
  return (
    <Wrapper>
      <TextMinor>
        There is no available address in your extension wallet, please make sure
        you have created address.
      </TextMinor>
    </Wrapper>
  );
};

export default NoAddress;
