import React from "react";
import styled from "styled-components";
import { Divider } from "semantic-ui-react";

import SubTitle from "../../components/SubTitle";
import LinkItem from "./LinkItem";

const Wrapper = styled.div`
  margin-bottom: 32px;
`

const Header = styled(SubTitle)`
  margin-bottom: 16px;
`;

const DividerWrapper = styled(Divider)`
  border-top: 1px solid #EEEEEE !important;
  margin: 0 !important;
`;

const LinksWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
  flex-direction: column;
`;

const RelatedLinks = ({ data }) => {
  if (data && data.length > 0) {
    return (
      <Wrapper>
        <Header>Related Links</Header>
        <LinksWrapper>
          {data.map((item, index) => (
            <LinkItem link={item} key={index} />
          ))}
        </LinksWrapper>
        <DividerWrapper />
      </Wrapper>
    )
  } else {
    return null;
  }
}

export default RelatedLinks;
