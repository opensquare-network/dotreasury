import styled, { css } from "styled-components";

const CustomLabelIcon = styled.div`
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
            ? p.disabledColor ?? "var(--textDisable)"
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

export default CustomLabelIcon;
