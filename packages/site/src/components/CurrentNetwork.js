import React from "react";
import styled from "styled-components";

import TextMinor from "./TextMinor";
import { TEXT_DARK_MAJOR } from "../constants";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import Setting from "./Setting";

const Wrapper = styled.div`
  display: flex;
  @media screen and (max-width: 640px) {
    justify-content: center;
  }

  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fbfbfb;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const Dark = styled.span`
  color: ${TEXT_DARK_MAJOR};
`;

const Cap = styled.span`
  text-transform: capitalize;
`;

const SettingWrapper = styled.div`
  @media screen and (max-width: 640px) {
    display: none;
  }
`;

const CurrentNetwork = () => {
  const chain = useSelector(chainSelector);
  return (
    <Wrapper>
      <TextMinor>
        You are under the{" "}
        <Dark>
          <Cap>{chain}</Cap> network
        </Dark>
      </TextMinor>
      <SettingWrapper>
        <Setting />
      </SettingWrapper>
    </Wrapper>
  );
};

export default CurrentNetwork;
