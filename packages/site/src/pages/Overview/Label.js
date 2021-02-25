import React from "react";
import styled, { css } from "styled-components";
import { Popup } from "semantic-ui-react";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { mrgap } from "../../styles";

const Wrapper = styled.div`
  background: #fbfbfb;
  width: 224px;
  padding: 4px 16px;
  display: flex;
  align-items: center;
  ${css`${mrgap("8px")}`}
  border-radius: 4px;
  :hover {
    cursor: pointer;
  }
`;

const IconWrapper = styled.div`
  height: 16px;
  width: 16px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Icon = styled.div`
  width: 10px;
  height: 10px;
  border: 3px solid ${(p) => (p.disabled ? "rgba(29, 37, 60, 0.24)" : p.color)};
  border-radius: 50%;
`;

const LabelText = styled(Text)`
  font-weight: 500;
  ${(p) =>
    p.disabled &&
    css`
      color: rgba(29, 37, 60, 0.24);
    `}
`;

const ValueText = styled(TextMinor)`
  /* font-weight: 300; */
  /* font-size: 0.8em; */
  margin-left: auto !important;
  ${(p) =>
    p.disabled &&
    css`
      color: rgba(29, 37, 60, 0.24);
    `}
`;

const Label = ({ name, value, color, disabled, onToggleDisabled }) => {
  return (
    <Wrapper onClick={onToggleDisabled}>
      <IconWrapper>
        <Icon color={color} disabled={disabled} />
      </IconWrapper>
      <LabelText disabled={disabled}>{name}</LabelText>
      <Popup
        content={`${value} KSM`}
        size='mini'
        trigger={<ValueText disabled={disabled}>{`${Math.round(value) === value ? "" : "≈ "}${Math.round(value)} KSM`}</ValueText>}
        />
    </Wrapper>
  );
};

export default Label;
