import startCase from "lodash.startcase";
import React from "react";
import styled from "styled-components";
import TagOrigin from "../../components/Tag";

const Wrapper = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: var(--textPrimary);

  > div {
    overflow-wrap: break-word;
  }

  span + span {
    &:before {
      margin-left: 4px;
      margin-right: 4px;
      content: "·";
    }
  }
`;

const Tag = styled(TagOrigin)`
  display: inline-flex;
`;

const DescriptionCell = ({ description, tags = {}, trackInfo }) => {
  return (
    <Wrapper>
      <div>{description}</div>
      {trackInfo && <Tag text={startCase(trackInfo.name)} />}
      {tags.proposalType && <Tag text={tags.proposalType} />}
      {tags.status && <Tag text={tags.status} />}
    </Wrapper>
  );
};

export default DescriptionCell;
