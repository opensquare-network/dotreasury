import styled from "styled-components";
import { p_12_normal } from "../../styles/text";

const triangleWidth = 6;

export const TooltipArrow = styled.div`
  position: absolute;
  border: ${triangleWidth}px solid transparent;
  border-top-color: var(--tooltipBg);
  left: ${(p) => p.x ?? 0}px;
`;

export const TooltipContainer = styled.div`
  background-color: var(--tooltipBg);
  color: var(--textPrimaryContrast);
  ${p_12_normal};
  padding: 8px;
  border-radius: 4px;
  display: none;

  &[data-show="true"] {
    display: block;
  }

  &[data-placement^="top"] > ${TooltipArrow} {
    bottom: -${triangleWidth * 2}px;
  }

  &[data-placement^="bottom"] > ${TooltipArrow} {
    top: -${triangleWidth * 2}px;
    transform: rotate(180deg);
  }
`;

export const TooltipInfoText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;
