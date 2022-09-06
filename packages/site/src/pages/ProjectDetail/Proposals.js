import React from "react";
import styled from "styled-components";

import { PRIMARY_THEME_COLOR } from "../../constants";
import Card from "../../components/Card";
import ProposalInfo from "./ProposalInfo";

const Wrapper = styled(Card)`
  padding: 20px 24px;
  margin-bottom: 24px;
`;

const Header = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;

  & > div:last-child {
    flex-grow: 1;
    margin-left: 12px;
  }

  &:last-child {
    .bar {
      visibility: hidden;
    }
  }
`;

const VerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  & > div:last-child {
    flex-grow: 1;
  }
`;

const CircleWrapper = styled.div`
  width: 24px;
  height: 24px;
  padding: 6px;

  div {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 3px solid ${PRIMARY_THEME_COLOR};
    border-radius: 50%;
  }

  flex: 0 0 auto;
`;

const Bar = styled.div`
  width: 2px;
  margin: 0 11px;
  background: #f292a4;
  flex: 0 0 auto;
`;

const ProposalInfoWrapper = styled.div`
  margin-bottom: 40px;
`;

const Proposals = ({ data }) => {
  if (data) {
    return (
      <Wrapper>
        <Header>Proposals</Header>
        <div>
          {(data || []).map((item, index) => {
            return (
              <ContentWrapper key={index}>
                <VerticalWrapper>
                  <CircleWrapper>
                    <div />
                  </CircleWrapper>
                  <Bar className="bar" />
                </VerticalWrapper>
                <VerticalWrapper>
                  <ProposalInfoWrapper>
                    <ProposalInfo item={item} />
                  </ProposalInfoWrapper>
                </VerticalWrapper>
              </ContentWrapper>
            );
          })}
        </div>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default Proposals;
