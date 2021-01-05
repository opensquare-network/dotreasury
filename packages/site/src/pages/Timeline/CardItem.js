import React from "react";
import styled from "styled-components";

import {TEXT_DARK_MAJOR, TEXT_DARK_MINOR} from "../../constants"

const Wrapper = styled.div`
  display: flex;
  padding: 4px 16px;
  align-item: center;
  gap: 8px;
  flex-wrap: wrap;
  & > .title {
    width: 120px;
    color: ${TEXT_DARK_MAJOR};
    font-weight: 500;
    line-height: 24px;
    flex-shrink: 0;
  }
  & > .value {
    flex: 1 1 auto;
    color: ${TEXT_DARK_MINOR};
    word-break: break-word;
  }
`;

const CardItem = ({ title, children }) => {
  return (
    <Wrapper>
      {title && <div className="title">{title}</div>}
      <div className="value">{children}</div>
    </Wrapper>
  );
};

export default CardItem;
