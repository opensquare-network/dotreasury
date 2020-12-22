import React from "react";
import styled from "styled-components";

const getCurrent = (current) => {
  let str = "";
  [...Array(current).keys()].map(
    (item) =>
      (str += `
    div:nth-child(${item + 1}) {
      background: #DF405D;
    }
  `)
  );
  return str;
};

const Wrapper = styled.div`
  flex-grow: 1;
  min-width: 228px;
  height: 6px;
  display: flex;
  gap: 4px;
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
  background: #ffecef;
  flex-grow: 1;
  height: 6px;
`;

const TippersProgress = ({ current, total }) => {
  const progress = [...Array(total).keys()].map((item) => (
    <ProgressItem key={item} />
  ));
  return <Wrapper current={current}>{progress}</Wrapper>;
};

export default TippersProgress;
