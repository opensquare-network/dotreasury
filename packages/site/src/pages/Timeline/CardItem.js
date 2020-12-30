import React from "react";
import styled from "styled-components";

import {TEXT_DARK_MAJOR, TEXT_DARK_MINOR} from "../../constants"

const Wrapper = styled.div`
  display: flex;
  padding: 4px 16px;
  align-item: center;
  gap: 8px;
  flex-wrap: wrap;
  & > div:first-child {
    width: 120px;
    color: ${TEXT_DARK_MAJOR};
    font-weight: 500;
    line-height: 24px;
    flex-shrink: 0;
  }
  & > div:last-child {
    flex-grow: 1 1 auto;
    color: ${TEXT_DARK_MINOR};
    word-break: break-word;
  }
`;

const CardItem = ({ title, children }) => {
  return (
    <Wrapper>
      <div>{title}</div>
      <div>{children}</div>
    </Wrapper>
  );
};

export default CardItem;
