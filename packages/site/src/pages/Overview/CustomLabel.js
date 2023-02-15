import React from "react";
import styled, { css } from "styled-components";
import { Popup } from "semantic-ui-react";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { p_12_normal, p_14_medium, p_14_normal } from "../../styles/text";
import { TEXT_DARK_ACCESSORY } from "../../constants";
import {
  flex,
  flex_col,
  gap_x,
  items_center,
  items_end,
  p_y,
} from "../../styles/tailwindcss";
import { sumBy } from "../../utils/math";

const Wrapper = styled.div`
  min-width: 224px;
  background: #fbfbfb;
  padding: 8px 12px;
  border-radius: 4px;
`;

const ItemWrapper = styled.div`
  cursor: pointer;
`;

const Icon = styled.div`
  ${(p) =>
    p.icon === "square" &&
    css`
      width: 10px;
      height: 10px;
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
  ${(p) =>
    p.icon === "solid" &&
    css`
      width: 10px;
      height: 3px;
      background: ${p.color ?? "#EEEEEE"};
      border-radius: 1px;
    `}
`;

const Title = styled(Text)`
  ${p_14_medium};
  ${(p) =>
    p.disabled &&
    css`
      color: rgba(29, 37, 60, 0.24);
    `}
`;
const TitleCount = styled(Text)`
  ${p_14_normal};
  color: ${TEXT_DARK_ACCESSORY};
  ${(p) =>
    p.disabled &&
    css`
      color: rgba(29, 37, 60, 0.24);
    `}
`;
const TitleWrapper = styled.div`
  ${flex};
  ${gap_x(8)};
  ${items_center};
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

const ChildrenWrapper = styled.div`
  ${ItemWrapper} {
    ${p_y(4)};
  }
`;

const Label = ({ data, icon, status, clickEvent }) => {
  const symbol = useSelector(chainSymbolSelector);
  const { name, count, color, iconColor, iconDisabledColor, children } = data;
  const disabled = status?.disabled;
  let { value, fiatValue } = data;

  if (children?.length) {
    if (!value) {
      value = sumBy(children, "value");
    }
    if (!fiatValue) {
      fiatValue = sumBy(children, "fiatValue");
    }
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
          {count && <TitleCount disabled={disabled}>{count}</TitleCount>}
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
        </TitleWrapper>

        {!!fiatValue && (
          <ValueWrapper disabled={disabled}>
            <TextFiatValue>
              ≈ ${Math.round(fiatValue).toLocaleString()}
            </TextFiatValue>
          </ValueWrapper>
        )}
      </ItemWrapper>
      <ChildrenWrapper>
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
                  </ValueWrapper>
                }
              />
            </TitleWrapper>

            {!!item.fiatValue && (
              <ValueWrapper disabled={disabled}>
                <TextFiatValue>
                  ≈ ${Math.round(item.fiatValue).toLocaleString()}
                </TextFiatValue>
              </ValueWrapper>
            )}
          </ItemWrapper>
        ))}
      </ChildrenWrapper>
    </Wrapper>
  );
};

export default Label;
