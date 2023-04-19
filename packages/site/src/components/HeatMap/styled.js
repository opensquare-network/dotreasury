import styled, { css } from "styled-components";
import { p_14_medium } from "../../styles/text";

export const HeatMapWrapper = styled.div``;

export const HeatMapDot = styled.span`
  width: 12px;
  height: 12px;

  outline: 2px solid;
  outline-offset: -2px;
  outline-color: rgba(0, 0, 0, 0.02);

  background-color: var(--neutral300);

  border-radius: 2px;

  ${(p) =>
    p.dotStyle === "circle" &&
    css`
      border-radius: 9999px;
    `}

  ${(p) =>
    p.color &&
    css`
      background-color: ${p.color};
    `}
`;

export const HeatMapContent = styled.div`
  display: flex;
  gap: 3.92px;
  flex-wrap: wrap;
`;

export const HeatMapLegendWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;
export const HeatMapLegendContent = styled.div`
  display: flex;
`;
export const HeatMapLegend = styled.span`
  display: inline-flex;
  align-items: center;
  ${p_14_medium};

  ${HeatMapDot} {
    width: 10px;
    height: 10px;
    margin-right: 12px;
  }

  & + & {
    margin-left: 20px;
  }
`;
