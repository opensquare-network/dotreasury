import React from "react";
import styled, { css } from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";

const Wrapper = styled.div`
  min-width: 224px;
  background: #fbfbfb;
  padding: 4px 16px;
  border-radius: 4px;
`

const ItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  :not(:last-child) {
    margin-bottom: 4px;
  }
`

const IconWrapper = styled.div`
  height: 16px;
  width: 16px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Icon = styled.div`
  ${(p => p.icon === "square" && css`
      width: 8px;
      height: 8px;
      background: ${p.color ?? "#EEEEEE"};
      border-radius: 1px;
    `
  )}
  ${(p => p.icon === "circle" && css`
      width: 10px;
      height: 10px;
      border: 3px solid ${(p) => (p.disabled ? "rgba(29, 37, 60, 0.24)" : p.color ?? "#EEEEEE")};
      border-radius: 50%;
    `
  )}
`

const Title = styled(Text)`
  font-weight: 500;
  line-height: 24px;
`

const ChildTitle = styled(TextMinor)`
  font-weight: 500;
  line-height: 24px;
`

const ValueWrapper = styled.div`
  display: flex;
  margin-left: auto;
  & > :last-child {
    margin-left: 4px;
  }
`

const Label = ({ data, icon, clickEvent }) => {
  const { name, color, disabled, children } = data;
  let { value } = data;
  if (children) {
    value = (children || []).reduce((acc, current) => {
      return acc + current.value ?? 0;
    }, 0)
  }
  return (
    <Wrapper>
      <ItemWrapper onClick={() => {
        clickEvent && clickEvent(name)
      }} disabled={disabled} >
        <IconWrapper>
          {!children && <Icon icon={icon} color={color} />}
        </IconWrapper>
        <Title>{name}</Title>
        <ValueWrapper>
          <TextMinor>{value ?? 0}</TextMinor>
          <TextMinor>KSM</TextMinor>
        </ValueWrapper>
      </ItemWrapper>
      {(children || []).map((item, index) => (
        <ItemWrapper key={index} onClick={() => {
          clickEvent && clickEvent(item.name)
        }}>
          <IconWrapper>
            <Icon icon={icon} color={item.color} />
          </IconWrapper>
          <ChildTitle>{item.name}</ChildTitle>
          <ValueWrapper>
            <TextMinor>{item.value ?? 0}</TextMinor>
            <TextMinor>KSM</TextMinor>
          </ValueWrapper>
        </ItemWrapper>)
      )}
    </Wrapper>
  )
}

export default Label;
