import React from "react";
import styled from "styled-components";

const Wrapper = styled.span`

`

export default function Addr({ children = '', length = 5 }) {
  const shortAddr = children.substring(0, length) + '...' + children.substring(children.length - length)

  return (
    <Wrapper title={children}>{shortAddr}</Wrapper>
  )
}
