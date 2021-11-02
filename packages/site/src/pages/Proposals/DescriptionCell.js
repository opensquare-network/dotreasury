import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.9);
`;

const DividerWrapper = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  > :not(:first-child) {
    ::before {
      content: "·";
      margin: 0 4px;
    }
  }
`;

const DescriptionCell = () => {
  return (
    <Wrapper>
      <div>DescriptionCell</div>
      <DividerWrapper>
        <div>Development</div>
        <div>Working</div>
      </DividerWrapper>
    </Wrapper>
  );
};

export default DescriptionCell;
