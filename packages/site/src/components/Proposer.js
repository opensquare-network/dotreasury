import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Voter from "./Voter";
import BarProgress from "./BarProgress";
import TextMinor from "./TextMinor";
import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../constants";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`;

const BarProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
  margin-top: 8px;
`;

const CustomText = styled(TextMinor)`
  white-space: nowrap;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AyeNayWrapper = styled.div`
  display: flex;
  align-items: center;
  & > :not(:last-child) {
    margin-right: 16px;
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  & > :not(:last-child) {
    margin-right: 8px;
  }
`;

const ProposalArgsWrapper = styled.div`
  padding: 4px 16px;
  display: flex;
  flex-direction: column;
  background-color: #fbfbfb;
`;

const ProposalArgsItemWrapper = styled.div`
  padding: 4px 0px;
  display: flex;
  align-items: center;
  & > :not(:last-child) {
    margin-right: 8px;
  }
  flex-wrap: wrap;
  & > .title {
    width: 120px;
    color: ${TEXT_DARK_MAJOR};
    font-weight: 500;
    line-height: 24px;
    flex-shrink: 0;
  }
  & > .value {
    flex: 1 1 auto;
    color: ${TEXT_DARK_MINOR};
    word-break: break-word;
    :not(:first-child) > * {
      align-items: flex-start;
    }
  }
`;

const Proposer = ({ address, agree, value, args, threshold, ayes, nays }) => {
  return (
    <Wrapper>
      <Voter address={address} agree={agree} value={value} />

      {args && args.length > 0 && (
        <ProposalArgsWrapper>
          {args.map(({ title, value }) => (
            <ProposalArgsItemWrapper key={title}>
              <div className="title">{title}</div>
              <div className="value">{value}</div>
            </ProposalArgsItemWrapper>
          ))}
        </ProposalArgsWrapper>
      )}

      <BarProgressWrapper>
        <BarProgress current={ayes} total={threshold} />
        <TextWrapper>
          <CustomText>{`${ayes}/${threshold}`}</CustomText>
          <AyeNayWrapper>
            <ItemWrapper>
              <CustomText>Aye ({ayes})</CustomText>
              <Image src="/imgs/aye.svg" />
            </ItemWrapper>
            <ItemWrapper>
              <CustomText>Nay ({nays})</CustomText>
              <Image src="/imgs/nay.svg" />
            </ItemWrapper>
          </AyeNayWrapper>
        </TextWrapper>
      </BarProgressWrapper>
    </Wrapper>
  );
};

export default Proposer;
