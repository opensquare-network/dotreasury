import React from "react";
import styled from "styled-components";

import Card from "../../components/Card";
import Doughnut from "../../components/CustomDoughnut";
import List from "./CustomList";
import Total from "./Total";
import Text from "../../components/Text";
import { abbreviateBigNumber } from "../../utils";
import {
  flex,
  flex_col,
  items_center,
  justify_between,
} from "../../styles/tailwindcss";

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;
const TitleGroup = styled.div`
  ${flex};
  ${items_center};
  ${justify_between};
`;

const CardWrapper = styled(Card)`
  position: relative;
  padding: 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const ContentWrapper = styled.div`
  /* position: relative; */
  display: flex;
  ${flex_col};
  /* padding: 32px; */
  @media screen and (max-width: 556px) {
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const CanvasWrapper = styled.div`
  height: 264px;
  position: relative;
`;

const DoughnutWrapper = styled.div`
  width: 214px;
  height: 214px;
  margin: 0 auto;
  position: absolute;
`;

const DoughnutCard = ({
  title,
  titleExtra,
  data,
  status,
  clickEvent,
  children,
}) => {
  const findDisabled = (name) => {
    const findFunc = (item) => {
      if (item.name === name) return item.disabled;
      if (item.children) {
        return item.children.find(findFunc);
      }
      return;
    };
    const result = status?.labels?.find(findFunc);
    return result;
  };
  const totalReduce = (acc, current) => {
    if (current.children) {
      return acc + current.children.reduce(totalReduce, 0);
    }
    return acc + (findDisabled(current.name) ? 0 : current.value ?? 0);
  };
  const total = abbreviateBigNumber(data.labels?.reduce(totalReduce, 0));
  return (
    <CardWrapper>
      <TitleGroup>
        <Title>{title}</Title>
        {titleExtra}
      </TitleGroup>
      <ContentWrapper>
        <CanvasWrapper>
          <Total total={total}>
            <DoughnutWrapper>
              <Doughnut data={data} status={status} />
            </DoughnutWrapper>
          </Total>
        </CanvasWrapper>
        <List data={data} status={status} clickEvent={clickEvent}></List>
        {children}
      </ContentWrapper>
    </CardWrapper>
  );
};

export default DoughnutCard;
