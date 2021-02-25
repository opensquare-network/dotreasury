import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";


const Wrapper = styled.div`
  position: relative;
  input {
    padding-right: 48px !important;
  }
`

const CustomImage = styled(Image)`
  padding: 12px 16px !important;
  position: absolute !important;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  opacity: 0.26;
  :hover {
    opacity: 1;
    cursor: pointer;
  }
`

const FormPasswordWrapper = ({children, show, toggleClick}) => {
  return (
    <Wrapper>
      {children}
      <CustomImage src={show ? "/imgs/eye.svg" : "/imgs/eye-slash.svg"} onClick={toggleClick} />
    </Wrapper>
  )
}

export default FormPasswordWrapper;
