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
`;

const TextWrapper = styled(Text)`
  /* white-space: nowrap;  */
`;

const NameCell = ({ logo, name }) => {
  return (
    <Wrapper>
      <Image
        src={logo ? `/imgs/projects/${logo}` : "/imgs/default-logo.svg"}
        width={24}
        height={24}
      />
      <TextWrapper>{name}</TextWrapper>
    </Wrapper>
  );
};

export default NameCell;
