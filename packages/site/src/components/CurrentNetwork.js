import React from "react";
import styled from "styled-components";

import TextMinor from "./TextMinor";
import { TEXT_DARK_MAJOR } from "../constants";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";

const Wrapper = styled.div`
  display: flex;
  padding: 12px 20px;
  justify-content: center;
  background: #fbfbfb;
  border-radius: 8px;
  margin-bottom: 24px;
  p {
    margin-bottom: 10px;
  }
`;

const TextMajor = styled.span`
  color: ${TEXT_DARK_MAJOR};
`;

const Cap = styled.span`
  text-transform: capitalize;
`;

const CurrentNetwork = () => {
  const chain = useSelector(chainSelector);
  return (
    <Wrapper>
      <TextMinor>
        You are under the{" "}
        <TextMajor>
          <Cap>{chain}</Cap> network
        </TextMajor>
      </TextMinor>
    </Wrapper>
  );
};

export default CurrentNetwork;
