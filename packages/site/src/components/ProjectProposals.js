import React from "react";
import styled from "styled-components";
import ImageWithDark from "./ImageWithDark";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PlusWrapper = styled.div`
  font-size: 14px !important;
  line-height: 20px !important;
  color: var(--textTertiary) !important;
  margin: 0 4px !important;
  font-weight: 400 !important;
  :first-child {
    display: none;
  }
  :last-child {
    display: none;
  }
`;

const Item = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
  display: flex;
  align-items: center;
  > img {
    margin-left: 4px;
  }
`;

export default function ProjectProposals({
  dotProposalsCount,
  ksmProposalsCount,
}) {
  return (
    <Wrapper>
      {dotProposalsCount > 0 && (
        <Item>
          {dotProposalsCount}
          <ImageWithDark src="/imgs/logo-polkadot.svg" />
        </Item>
      )}
      <PlusWrapper>+</PlusWrapper>
      {ksmProposalsCount > 0 && (
        <Item>
          {ksmProposalsCount}
          <ImageWithDark src="/imgs/logo-kusama.svg" />
        </Item>
      )}
    </Wrapper>
  );
}
