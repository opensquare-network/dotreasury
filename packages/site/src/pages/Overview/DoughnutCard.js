import React from "react";
import styled from "styled-components";

import Card from "../../components/Card";
import Doughnut from "../../components/CustomDoughnut";
import List from "./CustomList";
import Total from "./Total";

import Text from "../../components/Text";

const Title = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const CardWrapper = styled(Card)`
  position: relative;
  display: flex;
  min-height: 318px;
  padding: 32px;
  @media screen and (max-width: 556px) {
    flex-direction: column;
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const CanvasWrapper = styled.div`
  height: 252px;
  flex-grow: 1;
  position: relative;
`;

const DoughnutWrapper = styled.div`
  width: 214px;
  height: 214px;
  margin: 0 auto;
  position: absolute;
`;

const DoughnutCard = ({ title, data, status, clickEvent, children }) => {
  const findDisabled = (name) => {
    const findFunc = (item => {
      if (item.name === name) return item.disabled;
      if (item.children) {
        return item.children.find(findFunc);
      }
      return;
    })
    const result = status?.labels?.find(findFunc);
    return result;
  }
  const totalReduce = (acc, current) => {
    if (current.children) {
      return acc + current.children.reduce(totalReduce, 0);
    }
    return acc + (findDisabled(current.name) ? 0 : (current.value ?? 0));
  }
  const total = data.labels?.reduce(totalReduce, 0);
  return (
    <div>
      <Title>{title}</Title>
      <CardWrapper>
        <List data={data} status={status} clickEvent={clickEvent}></List>
        <CanvasWrapper>
          <Total total={total}>
            <DoughnutWrapper>
              <Doughnut data={data} status={status} />
            </DoughnutWrapper>
          </Total>
        </CanvasWrapper>
        {children}
      </CardWrapper>
    </div>
  );
};

export default DoughnutCard;
