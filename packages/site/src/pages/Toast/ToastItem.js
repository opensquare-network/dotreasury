import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Text from "../../components/Text";
import { removeToast } from "../../store/reducers/toastSlice";

const Wrapper = styled.div`
  max-width: calc(100% - 32px);
  padding: 8px 16px;
  background: #ffffff;
  box-shadow: 0px 4px 24px rgba(29, 37, 60, 0.08);
  border-radius: 8px;
  display: flex;
  align-items: center;
  img {
    margin-right: 8px;
  }
  p {
    word-wrap: break-word;
    word-break: break-all;
  }
  :not(:last-child) {
    margin-bottom: 24px;
  }
  pointer-events: auto;
`;

const TOAST_TYPES = ["success", "warnning", "error"];

const ToastItem = ({ type, message, id }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 5000);
  });
  if (!message) return null;
  return (
    <Wrapper
      onClick={() => {
        dispatch(removeToast(id));
      }}
    >
      {type && TOAST_TYPES.includes(type) && (
        <Image src={`/imgs/toast-${type}.svg`} />
      )}
      <Text>{message}</Text>
    </Wrapper>
  );
};

export default ToastItem;
