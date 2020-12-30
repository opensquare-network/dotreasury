import React from "react";
import styled from "styled-components";

import Item from "./Item";
import SubTitle from "../../components/SubTitle";

const Header = styled(SubTitle)`
  margin-bottom: 20px;
`;

const ItemList = styled.div``;

const Timeline = ({ data, contentBuilder }) => {
  return (
    <div>
      <Header>Timeline</Header>
      <ItemList>
        { (data || []).map((item, index) => <Item key={index} data={item} contentBuilder={contentBuilder} />) }
      </ItemList>
    </div>
  );
};

export default Timeline;
