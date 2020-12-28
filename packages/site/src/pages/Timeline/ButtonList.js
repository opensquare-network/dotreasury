import React from "react";
import styled from "styled-components";

import ImageButton from "./ImageButton";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const ButtonList = () => {
  return (
    <Wrapper>
      <ImageButton src={"/imgs/image-1.png"} />
      <ImageButton src={"/imgs/image-2.png"} />
    </Wrapper>
  );
};

export default ButtonList;
