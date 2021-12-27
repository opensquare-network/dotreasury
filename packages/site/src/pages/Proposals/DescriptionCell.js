import React from "react";
import styled from "styled-components";
import Tag from "../../components/Tag";

const Wrapper = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.9);

  > div {
    overflow-wrap: break-word;
  }
  span:nth-child(3):before {
    margin-left: 4px;
    margin-right: 4px;
    content:'·';
  }
`;

const DescriptionCell = ({description, tags}) => {
  return (
    <Wrapper>
      <div>
        {description}
      </div>
      {tags.proposalType && <Tag text={tags.proposalType}/>}
      {tags.status && <Tag text={tags.status}/>}
    </Wrapper>
  );
};

export default DescriptionCell;
