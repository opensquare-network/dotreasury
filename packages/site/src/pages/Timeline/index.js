import React from "react";
import styled from "styled-components";

import Item from "./Item";
import FoldableItem from "./FoldableItem";
import SubTitle from "../../components/SubTitle";

const Wrapper = styled.div`
  max-width: 100%;
`

const Header = styled(SubTitle)`
  margin-bottom: 20px;
`;

const Timeline = ({ data, contentBuilder }) => {
  return (
    <Wrapper>
      <Header>Timeline</Header>
      {/* <FoldableItem> */}
        <>
          { (data || []).map((item, index) => <Item key={index} data={item} contentBuilder={contentBuilder} />) }
        </>
      {/* </FoldableItem> */}
    </Wrapper>
  );
};

export default Timeline;
