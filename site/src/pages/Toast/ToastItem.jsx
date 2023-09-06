import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { removeToast } from "../../store/reducers/toastSlice";
import { useIsMounted } from "@osn/common";
import IconMask from "../../components/Icon/Mask";
import ImageWithDark from "../../components/ImageWithDark";
import { shadow_200 } from "../../styles/tailwindcss";

const Wrapper = styled.div`
  width: 320px;
  padding: 16px;
  ${shadow_200};
  border-radius: 8px;
  p {
    word-break: break-word;
  }
  :not(:last-child) {
    margin-bottom: 16px;
  }
  background: var(--neutral100);
  border: 1px solid var(--neutral300);
  transform: translateX(200%);
  transition: all 0.25s ease-out;
  &.tran {
    transform: translateX(0) !important;
  }
`;

const ImageWrapper = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.div`
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Text)`
  font-weight: 500;
  flex-grow: 1;
  text-transform: capitalize;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Content = styled(TextMinor)`
  padding-left: 32px;
`;

const TOAST_TYPES = ["success", "error", "pending", "warning"];

const ToastItem = ({ type, title, message, id, sticky, timeout = 5000 }) => {
  const [tranClass, setTranClass] = useState("");
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  useEffect(() => {
    if (sticky) {
      return;
    }
    setTimeout(() => {
      dispatch(removeToast(id));
    }, timeout);
  }, [dispatch, id, sticky, timeout]);

  useEffect(() => {
    setTimeout(() => {
      if (isMounted.current) {
        setTranClass("tran");
      }
    }, 100);
  });

  if (!message) return null;
  return (
    <Wrapper type={type} className={tranClass}>
      <HeaderWrapper>
        <ImageWrapper>
          {type && TOAST_TYPES.includes(type) && (
            <ImageWithDark src={`/imgs/toast-${type}.svg`} />
          )}
        </ImageWrapper>
        <Title>{title}</Title>
        <CloseButton
          onClick={() => {
            dispatch(removeToast(id));
          }}
        >
          <IconMask src="/imgs/toast-close.svg" size={24} color="textPrimary" />
        </CloseButton>
      </HeaderWrapper>
      <Content>{message}</Content>
    </Wrapper>
  );
};

export default ToastItem;
