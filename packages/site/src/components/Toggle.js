import React from "react";
import styled, { css } from "styled-components";

import { PRIMARY_THEME_COLOR } from "../constants"

const Wrapper = styled.div`
  width: 56px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  background-color: #E1E1E1;
  padding: 3px;
  ${p => p.checked && css`
    background-color: ${PRIMARY_THEME_COLOR};
    & > div {
      margin-left: auto;
    }
  `}
`

const Circle = styled.div`
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 13px;
`

const Toggle = ({ checked, onClick }) => {
  return (
    <Wrapper onClick={onClick} checked={checked}>
      <Circle />
    </Wrapper>
  )
}

export default Toggle;
