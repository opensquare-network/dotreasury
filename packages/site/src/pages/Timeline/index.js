import React from "react";
import styled from "styled-components";
import {Image} from "semantic-ui-react";

import Item from "./Item";
// import FoldableItem from "./FoldableItem";
import SubTitle from "../../components/SubTitle";

const Wrapper = styled.div`
  max-width: 100%;
`

const Header = styled(SubTitle)`
  margin-bottom: 20px;
`;

const LoadingWrapper = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ItemList = styled.div``;

const Timeline = ({ data, polkassembly, loading }) => {
  return (
    <Wrapper>
      <Header>Timeline</Header>
      { (loading && <LoadingWrapper><Image src="/imgs/loading.svg" /></LoadingWrapper>) ||
      <ItemList>
        { (data || []).map((item, index) => <Item key={index} data={item} polkassembly={polkassembly} />) }
      </ItemList>
      }
    </Wrapper>
  );
};

export default Timeline;
