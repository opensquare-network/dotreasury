import React from "react";
import styled, { css } from "styled-components";

import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../../constants";
import { mrgap } from "../../styles";

const Wrapper = styled.div`
  display: flex;
  padding: 4px 0;
  align-items: center;
  ${css`
    ${mrgap("8px")}
  `}
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
    :not(:first-child) > * {
      align-items: flex-start;
    }
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
