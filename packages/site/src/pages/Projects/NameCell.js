import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Text from "../../components/Text";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 8px;
  }
`

const NameCell = ({ icon, name }) => {
  return (
    <Wrapper>
      <Image src={icon || "/imgs/default-logo.svg"} width={24} height={24} />
      <Text>{name}</Text>
    </Wrapper>
  )
}

export default NameCell;
