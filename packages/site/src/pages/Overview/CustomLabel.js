import React from "react";
import styled, { css } from "styled-components";
import { Popup } from "semantic-ui-react";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.div`
  min-width: 224px;
  background: #fbfbfb;
  padding: 4px 16px;
  border-radius: 4px;
`;

const ItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  :not(:last-child) {
    margin-bottom: 4px;
  }
`;

const IconWrapper = styled.div`
  height: 16px;
  width: 16px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.div`
  ${(p) =>
    p.icon === "square" &&
    css`
      width: 8px;
      height: 8px;
      background: ${p.color ?? "#EEEEEE"};
      border-radius: 1px;
    `}
  ${(p) =>
    p.icon === "circle" &&
    css`
      width: 10px;
      height: 10px;
      border: 3px solid
        ${(p) => (p.disabled ? "rgba(29, 37, 60, 0.24)" : p.color ?? "#EEEEEE")};
      border-radius: 50%;
    `}
`;

const Title = styled(Text)`
  font-weight: 500;
  line-height: 24px;
  ${(p) =>
    p.disabled &&
    css`
      color: rgba(29, 37, 60, 0.24);
    `}
`;

const ChildTitle = styled(TextMinor)`
  font-weight: 500;
  line-height: 24px;
  ${(p) =>
    p.disabled &&
    css`
      color: rgba(29, 37, 60, 0.24);
    `}
`;

const ValueWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  & > :last-child {
    margin-left: 4px;
  }
  ${(p) =>
    p.disabled &&
    css`
      & > * {
        color: rgba(29, 37, 60, 0.24);
      }
    `}
`;

const Label = ({ data, icon, status, clickEvent }) => {
  const symbol = useSelector(chainSymbolSelector);
  const { name, color, children } = data;
  const disabled = status?.disabled;
  let { value } = data;
  if (children) {
    value = (children || []).reduce((acc, current) => {
      return acc + current.value ?? 0;
    }, 0);
  }

  return (
    <Wrapper>
      <ItemWrapper
        onClick={() => {
          clickEvent && clickEvent(name);
        }}
      >
        <IconWrapper>
          {!children && <Icon icon={icon} color={color} disabled={disabled} />}
        </IconWrapper>
        <Title disabled={disabled}>{name}</Title>
        <Popup
          content={`${value} ${symbol}`}
          size="mini"
          trigger={
            <ValueWrapper disabled={disabled}>
              <TextMinor>{`${
                Math.round(value) === value ? "" : "≈ "
              }${Math.round(value).toLocaleString()} ${symbol}`}</TextMinor>
            </ValueWrapper>
          }
        />
      </ItemWrapper>
      {(children || []).map((item, index) => (
        <ItemWrapper
          key={index}
          onClick={() => {
            clickEvent && clickEvent(item.name);
          }}
        >
          <IconWrapper>
            <Icon
              icon={icon}
              color={item.color}
              disabled={status?.children[index].disabled}
            />
          </IconWrapper>
          <ChildTitle disabled={status?.children[index].disabled}>
            {item.name}
          </ChildTitle>
          <Popup
            content={`${item.value} ${symbol}`}
            size="mini"
            trigger={
              <ValueWrapper disabled={status?.children[index].disabled}>
                <TextMinor>{`${
                  Math.round(item.value) === item.value ? "" : "≈ "
                }${Math.round(
                  item.value
                ).toLocaleString()} ${symbol}`}</TextMinor>
              </ValueWrapper>
            }
          />
        </ItemWrapper>
      ))}
    </Wrapper>
  );
};

export default Label;
