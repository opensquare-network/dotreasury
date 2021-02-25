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
  display: flex;
  height: 318px;
  padding: 32px;
`;

const CanvasWrapper = styled.div`
  flex-grow: 1;
  position: relative;
`;

const DoughnutWrapper = styled.div`
  width: 214px;
  height: 214px;
  margin: 0 auto;
  position: absolute;
`;

const DoughnutCard = ({ data, clickEvent }) => {
  const totalReduce = (acc, current) => {
    if (current.children) {
      return acc + current.children.reduce(totalReduce, 0);
    }
    return acc + current.value ?? 0;
  }
  const total = data.labels?.reduce(totalReduce, 0);
  return (
    <div>
      <Title>Income</Title>
      <CardWrapper>
        <List data={data} clickEvent={clickEvent}></List>
        <CanvasWrapper>
          <Total total={total}>
            <DoughnutWrapper>
              <Doughnut data={data} />
            </DoughnutWrapper>
          </Total>
        </CanvasWrapper>
      </CardWrapper>
    </div>
  );
};

export default DoughnutCard;
