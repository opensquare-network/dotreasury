import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const TimeText = styled(TextMinor)`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
`

const DateCell = ({ date }) => {
  const day = dayjs(date);
  return (
    <Wrapper>
      {date && day.isValid() &&
        <>
          <Text>{day.format("YYYY-MM-DD")}</Text>
          <TimeText>{day.format("hh:mm")}</TimeText>
        </>
      }
      {(!date || !day.isValid()) &&
        <>
          <Text>--</Text>
          <TimeText>--</TimeText>
        </>
      }
    </Wrapper>
  )
}

export default DateCell;
