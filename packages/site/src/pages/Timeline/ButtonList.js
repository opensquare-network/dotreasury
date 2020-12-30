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
      <ImageButton src={"/imgs/polkascan-logo.png"} />
      <ImageButton src={"/imgs/subscan-logo.png"} />
      <ImageButton src={"/imgs/polkassembly-logo.png"} />
    </Wrapper>
  );
};

export default ButtonList;
