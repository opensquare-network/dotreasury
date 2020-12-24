import React from "react";
import styled from "styled-components";

import Item from "./Item";
import SubTitle from "../../components/SubTitle";

const Header = styled(SubTitle)`
  margin-bottom: 20px;
`;

const ItemList = styled.div``;

const Timeline = () => {
  return (
    <div>
      <Header>Timeline</Header>
      <ItemList>
        <Item />
        <Item />
      </ItemList>
    </div>
  );
};

export default Timeline;
