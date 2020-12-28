import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/Text";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SmallTextMinor = styled(TextMinor)`
  font-size: 12px;
  line-height: 20px;
`

const Status = ({ status, time }) => {
  return (
    <Wrapper>
      <Text>{status}</Text>
      <SmallTextMinor>{time}</SmallTextMinor>
    </Wrapper>
  );
};

export default Status;
