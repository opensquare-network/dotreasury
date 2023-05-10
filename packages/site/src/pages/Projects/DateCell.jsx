import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import Text from "../../components/Text";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const DateCell = ({ date }) => {
  const day = dayjs(date);
  return (
    <Wrapper>
      {date && day.isValid() && <Text>{day.format("YYYY-MM-DD")}</Text>}
      {(!date || !day.isValid()) && <Text>--</Text>}
    </Wrapper>
  );
};

export default DateCell;
