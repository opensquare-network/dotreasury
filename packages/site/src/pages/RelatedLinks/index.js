import React from "react";
import styled from "styled-components";

import LinkItem from "./LinkItem";
import SubTitle from "../../components/SubTitle";

const Wrapper = styled.div`
  margin-top: 20px;
`;

const LinksWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const RelatedLinks = () => {
  return (
    <Wrapper>
      <SubTitle>Ralated Links</SubTitle>
      <LinksWrapper>
        <LinkItem
          src={"/imgs/youtube-logo.png"}
          text={"Youtube"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu integer integer a dolor placerat quis ultrices tortor quis."
          }
        />
        <LinkItem src={"/imgs/medium-logo.png"} text={"Medium"} />
        <LinkItem src={"/imgs/polkassembly-logo.svg"} text={"Polkassembly"} />
      </LinksWrapper>
    </Wrapper>
  );
};

export default RelatedLinks;
