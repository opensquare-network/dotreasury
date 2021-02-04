import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ToastItem from "./ToastItem";
import {
  toastsSelector
} from "../../store/reducers/toastSlice";

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 0;
  left: 0;
  top: 0;
  z-index: 999;
`

const ToastList = styled.div`
  margin-top: 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Toast = () => {
  const toasts = useSelector(toastsSelector);
  
  return (
    <Wrapper>
      <ToastList>
        {(toasts || []).map(({ type, message, id }) => 
          <ToastItem type={type} message={message} id={id} key={id} />
        )}
      </ToastList>
    </Wrapper>
  )
}

export default Toast;
