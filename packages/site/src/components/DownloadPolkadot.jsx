import React from "react";
import styled from "styled-components";

import TextMinor from "./TextMinor";
import ExternalLink from "./ExternalLink";

const Wrapper = styled.div`
  padding: 12px 20px;
  background: #fbfbfb;
  border-radius: 8px;
  margin-bottom: 24px;
  p {
    margin-bottom: 10px;
  }
`;

const StyledLink = styled(TextMinor)`
  color: var(--primary);
  cursor: pointer;
  text-decoration: underline;
`;

const DownloadPolkadot = () => {
  return (
    <Wrapper>
      <TextMinor>
        Polkadot-js extension not detected. No web3 account could be found.
        Visit this page on a computer with polkadot-js extension.
      </TextMinor>
      <ExternalLink href="https://polkadot.js.org/extension/">
        <StyledLink>{"Download Polkadot{.js} extension"}</StyledLink>
      </ExternalLink>
    </Wrapper>
  );
};

export default DownloadPolkadot;
