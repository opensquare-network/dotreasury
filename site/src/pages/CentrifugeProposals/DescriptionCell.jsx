import startCase from "lodash.startcase";
import React from "react";
import styled from "styled-components";
import TagOrigin from "../../components/Tag";
import VotesSummaryBar from "../../components/VotesSummaryBar";

const Wrapper = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: var(--textPrimary);
`;

const DotSplitWrapper = styled.div`
  & > :not(:first-child) {
    :before {
      color: var(--textTertiary);
      margin-left: 4px;
      margin-right: 4px;
      content: "·";
    }
  }
`;

const Tag = styled(TagOrigin)`
  display: inline-flex;
`;

const BarWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

const DescriptionCell = ({ description, tags = {}, trackInfo, tally }) => {
  return (
    <Wrapper>
      <div style={{ overflowWrap: "break-word" }}>{description}</div>
      <DotSplitWrapper>
        {trackInfo && <Tag text={startCase(trackInfo.name)} />}
        {tags.proposalType && <Tag text={tags.proposalType} />}
        {tags.status && <Tag text={tags.status} />}
        {tally && (
          <BarWrapper>
            <VotesSummaryBar tally={tally} />
          </BarWrapper>
        )}
      </DotSplitWrapper>
    </Wrapper>
  );
};

export default DescriptionCell;
