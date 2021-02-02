import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 999;
  pointer-events: none;
`

const ToastList = styled.div`
  margin: 88px auto 0;
  width: fit-content;
`

const Toast = () => {
  return (
    <Wrapper>
      <ToastList>
        123
      </ToastList>
      {/* Toast
      <button>test</button> */}
    </Wrapper>
  )
}

export default Toast;
