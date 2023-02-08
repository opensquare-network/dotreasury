import React from "react";
import styled from "styled-components";

import Doughnut from "../../components/CustomDoughnut";
import Total from "./Total";
import { abbreviateBigNumber } from "../../utils";
import OverviewBaseChartCard from "./ChartCard";

const CanvasWrapper = styled.div`
  position: relative;
`;

const DoughnutWrapper = styled.div`
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
    <OverviewBaseChartCard
      title={title}
      titleExtra={titleExtra}
      data={data}
      status={status}
      clickEvent={clickEvent}
      children={children}
      chart={
        <CanvasWrapper>
          <Total total={total}>
            <DoughnutWrapper>
              <Doughnut data={data} status={status} />
            </DoughnutWrapper>
          </Total>
        </CanvasWrapper>
      }
    />
  );
};

export default DoughnutCard;
