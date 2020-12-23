import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const TipLabel = styled.span`
  background: #ffecef;
  padding: 2px 12px;
  border-radius: 4px;
  font-family: Inter;
  font-size: 12px;
  line-height: 20px;
  color: #df405d;
`;

const ImageWrapper = styled(Image)`
  width: 22px;
  height: 22px;
  border-radius: 50%;
`;

const Label = () => {
  return (
    <Wrapper>
      <TipLabel>tip</TipLabel>
      <ImageWrapper src={"./imgs/image-1.png"} />
      <ImageWrapper src={"./imgs/image-2.png"} />
    </Wrapper>
  );
};

export default Label;
