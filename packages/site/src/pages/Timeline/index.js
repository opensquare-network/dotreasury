import React from "react";
import styled from "styled-components";

import Item from "./Item";

const Header = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 44px;
  color: #1d253c;
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
