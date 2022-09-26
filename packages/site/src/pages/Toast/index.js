import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ToastItem from "./ToastItem";
import {
  toastsSelector
} from "../../store/reducers/toastSlice";
import Container from "../../components/Container";

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 0;
  left: 0;
  top: 0;
  z-index: 9999999;
`

const ToastList = styled.div`
  margin-top: 88px;
  margin-left: auto;
  width: fit-content;
  display: flex;
  flex-direction: column;
`

const Toast = () => {
  const toasts = useSelector(toastsSelector);
  
  return (
    <Wrapper>
      <Container>
        <ToastList>
          {(toasts || []).map(({ type, title, message, id, sticky, timeout }) => (
            <ToastItem
              type={type}
              title={title || type}
              message={message}
              id={id}
              key={id}
              sticky={sticky}
              timeout={timeout}
            />
          ))}
        </ToastList>
      </Container>
    </Wrapper>
  )
}

export default Toast;
