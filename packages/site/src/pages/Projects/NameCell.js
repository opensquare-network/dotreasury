import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import ImageWithDark from "../../components/ImageWithDark";

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
      <ImageWithDark
        src={
          logo ? `/imgs/projects/${logo}` : "/imgs/projects/default-logo.svg"
        }
        width={24}
        height={24}
      />
      <TextWrapper>{name}</TextWrapper>
    </Wrapper>
  );
};

export default NameCell;
