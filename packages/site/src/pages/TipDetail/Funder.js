import React from "react";
import styled from "styled-components";

import User from "../../components/User";
import Balance from "../../components/Balance";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Funer = ({address, value}) => {
  return (
    <Wrapper>
      <User address={address} />
      <Balance value={value} />
    </Wrapper>
  )
}

export default Funer;
