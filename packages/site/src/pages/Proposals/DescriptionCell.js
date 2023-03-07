import startCase from "lodash.startcase";
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

  span + span {
    &:before {
      margin-left: 4px;
      margin-right: 4px;
      content: "·";
    }
  }
`;

const DescriptionCell = ({ description, tags, trackInfo }) => {
  return (
    <Wrapper>
      <div>{description}</div>
      {tags.proposalType && <Tag text={tags.proposalType} />}
      {tags.status && <Tag text={tags.status} />}
      {trackInfo && <Tag text={startCase(trackInfo.trackName)} />}
    </Wrapper>
  );
};

export default DescriptionCell;
