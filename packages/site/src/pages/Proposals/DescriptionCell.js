import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.9);
  > div {
    overflow-wrap: break-word;
  }
`;

const DescriptionCell = ({ description }) => {
  return (
    <Wrapper>
      <div>{description}</div>
    </Wrapper>
  );
};

export default DescriptionCell;
