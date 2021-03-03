import React from "react";
import styled from "styled-components";

import Button from "./Button";
import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../constants";
import GrayImage from "./GrayImage";

const StyledButton = styled(Button)`
  border: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  background-color: transparent !important;
`

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  & > img {
    margin-right: 8px;
    
  }
  color: ${TEXT_DARK_MINOR};
  :hover {
    & > img {
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    }
    text-decoration: underline;
    color: ${TEXT_DARK_MAJOR};
  }
`

const ButtonImage = ({src, onClick, children}) => {
  return (
    <StyledButton onClick={onClick}>
      <Wrapper>
        {src && <GrayImage src={src} />}
        {children}
      </Wrapper>
    </StyledButton>
  )
}

export default ButtonImage;
