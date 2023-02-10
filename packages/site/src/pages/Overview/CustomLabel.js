import React from "react";
import styled, { css } from "styled-components";
import { Popup } from "semantic-ui-react";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { p_12_normal } from "../../styles/text";
import { TEXT_DARK_ACCESSORY } from "../../constants";
import {
  flex,
  flex_col,
  gap_x,
  items_baseline,
  items_end,
  space_y,
} from "../../styles/tailwindcss";

const Wrapper = styled.div`
  min-width: 224px;
  background: #fbfbfb;
  padding: 8px 12px;
  border-radius: 4px;
  ${space_y(8)};
`;

const ItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
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
      border: 2px solid
        ${(p) =>
          p.disabled
            ? p.disabledColor ?? "rgba(29, 37, 60, 0.24)"
            : p.color ?? "#EEEEEE"};
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

const TitleWrapper = styled.div`
  ${flex};
  ${gap_x(8)};
  ${items_baseline};
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

const TextFiatValue = styled(TextMinor)`
  ${p_12_normal};
  color: ${TEXT_DARK_ACCESSORY};
`;
const ValueWrapper = styled.div`
  display: flex;
  ${flex_col};
  ${items_end};
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
  const { name, color, iconColor, iconDisabledColor, children } = data;
  const disabled = status?.disabled;
  let { value, fiatValue } = data;
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
        <TitleWrapper>
          {icon && (
            <Icon
              icon={icon}
              color={iconColor ?? color}
              disabled={disabled}
              disabledColor={iconDisabledColor}
            />
          )}
          <Title disabled={disabled}>{name}</Title>
        </TitleWrapper>
        <Popup
          content={`${value} ${symbol}`}
          size="mini"
          trigger={
            <ValueWrapper disabled={disabled}>
              <TextMinor>{`${
                Math.round(value) === value ? "" : "≈ "
              }${Math.round(value).toLocaleString()} ${symbol}`}</TextMinor>

              {fiatValue && (
                <TextFiatValue>
                  ${Math.round(fiatValue).toLocaleString()}
                </TextFiatValue>
              )}
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
          <TitleWrapper>
            {icon && (
              <Icon
                icon={icon}
                color={item.iconColor ?? item.color}
                disabled={status?.children?.[index]?.disabled}
                disabledColor={item.iconDisabledColor}
              />
            )}
            <ChildTitle disabled={status?.children?.[index]?.disabled}>
              {item.name}
            </ChildTitle>
          </TitleWrapper>
          <Popup
            content={`${item.value} ${symbol}`}
            size="mini"
            trigger={
              <ValueWrapper disabled={status?.children?.[index]?.disabled}>
                <TextMinor>{`${
                  Math.round(item.value) === item.value ? "" : "≈ "
                }${Math.round(
                  item.value
                ).toLocaleString()} ${symbol}`}</TextMinor>

                {item.fiatValue && (
                  <TextFiatValue>
                    ${Math.round(item.fiatValue).toLocaleString()}
                  </TextFiatValue>
                )}
              </ValueWrapper>
            }
          />
        </ItemWrapper>
      ))}
    </Wrapper>
  );
};

export default Label;
