import React from "react";
import styled, { css } from "styled-components";

import { mrgap } from "../styles";

const getCurrent = (current) => {
  let str = "";
  [...Array(current).keys()].map(
    (item) =>
      (str += `
    div:nth-child(${item + 1}) {
      background: var(--primary);
    }
  `),
  );
  return str;
};

const Wrapper = styled.div`
  flex-grow: 1;
  min-width: 200px;
  height: 6px;
  display: flex;
  ${css`
    ${mrgap("4px")}
  `}
  align-items: center;
  div:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  div:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  ${(p) => getCurrent(p.current)}
`;

const ProgressItem = styled.div`
  background: var(--secondary);
  flex: 1 1;
  height: 6px;
`;

const TippersProgress = ({ current, total }) => {
  if (!total || isNaN(total)) return null;
  const progress = [...Array(total).keys()].map((item) => (
    <ProgressItem key={item} />
  ));
  return <Wrapper current={current}>{progress}</Wrapper>;
};

export default TippersProgress;
