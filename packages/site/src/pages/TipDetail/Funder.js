import React from "react";
import styled from "styled-components";

import User from "../../components/User/Index";
import Balance from "../../components/Balance";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`

const CustomUser = styled(User)`
    overflow: visible !important;
    background: red !importnat;
    width: 500px !importnat;
`

const VoterItem = ({address, value}) => {
  return (
    <Wrapper>
      <CustomUser address={address} />
      <Balance value={value} />
    </Wrapper>
  )
}

export default VoterItem;
