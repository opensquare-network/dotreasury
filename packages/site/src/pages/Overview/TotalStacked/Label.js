import React from "react";
import styled, { css } from "styled-components";

import Text from "../../../components/Text";
import TextMinor from "../../../components/TextMinor";

const Wrapper = styled.div`
  min-width: 224px;
  background: #fbfbfb;
  padding: 4px 16px;
  border-radius: 4px;
`

const ItemWrapper = styled.div`
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

const Label = ({ data, icon }) => {
  const { name, children } = data;
  let { value } = data;
  if (children) {
    value = (children || []).reduce((acc, current) => {
      return acc + current.value ?? 0;
    }, 0)
  }
  return (
    <Wrapper>
      <ItemWrapper>
        <IconWrapper>
          {!children && <Icon icon={icon} />}
        </IconWrapper>
        <Title>{name}</Title>
        <ValueWrapper>
          <TextMinor>{value ?? 0}</TextMinor>
          <TextMinor>KSM</TextMinor>
        </ValueWrapper>
      </ItemWrapper>
      {(children || []).map(item => (
        <ItemWrapper>
          <IconWrapper>
            <Icon icon={icon} />
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
