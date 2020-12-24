import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const ImageWrapper = styled(Image)`
  width: 22px;
  height: 22px;
  border-radius: 50%;
`;

const ButtonList = () => {
  return (
    <Wrapper>
      <ImageWrapper src={"./imgs/image-1.png"} />
      <ImageWrapper src={"./imgs/image-2.png"} />
    </Wrapper>
  );
};

export default ButtonList;
