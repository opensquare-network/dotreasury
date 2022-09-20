import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { removeToast } from "../../store/reducers/toastSlice";
import { useIsMounted } from "../../utils/hooks";

const Wrapper = styled.div`
  width: 320px;
  padding: 16px;
  box-shadow: 0px 4px 24px rgba(29, 37, 60, 0.08);
  border-radius: 8px;
  p {
    word-break: break-word;
  }
  :not(:last-child) {
    margin-bottom: 16px;
  }
  background: #FFF;
  border: 1px solid #EEE;
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
`

const CloseButton = styled.div`
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled(Text)`
  font-weight: 500;
  flex-grow: 1;
  text-transform: capitalize;
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Content = styled(TextMinor)`
  padding-left: 32px;
`

const TOAST_TYPES = ["success", "error", "pending"];

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
  })

  if (!message) return null;
  return (
    <Wrapper type={type} className={tranClass}>
      <HeaderWrapper>
        <ImageWrapper>
          {type && TOAST_TYPES.includes(type) && (
            <Image src={`/imgs/toast-${type}.svg`} />
          )}
        </ImageWrapper>
        <Title>{title}</Title>
        <CloseButton>
          <Image src="/imgs/toast-close.svg"
            onClick={() => {
              dispatch(removeToast(id));
            }} />
        </CloseButton>
      </HeaderWrapper>
      <Content>{message}</Content>
    </Wrapper>
  );
};

export default ToastItem;
