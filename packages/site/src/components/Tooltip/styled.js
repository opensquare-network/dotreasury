import styled from "styled-components";
import { p_14_medium } from "../../styles/text";

const triangleWidth = 6;

export const TooltipArrow = styled.div`
  visibility: hidden;

  &,
  &::before {
    position: absolute;
    border: ${triangleWidth}px solid transparent;
    left: -${triangleWidth}px;
    border-top-color: rgba(0, 0, 0, 0.72);
  }

  &::before {
    visibility: visible;
    content: "";
  }
`;

export const TooltipContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.72);
  color: white;
  font-weight: bold;
  padding: 8px;
  border-radius: 4px;
  display: none;

  &[data-show="true"] {
    display: block;
  }

  &[data-popper-placement^="top"] > ${TooltipArrow} {
    bottom: -${triangleWidth}px;
  }

  &[data-popper-placement^="bottom"] > ${TooltipArrow} {
    top: -${triangleWidth * 3}px;
    &::before {
      transform: rotate(180deg);
    }
  }
`;

export const TooltipTitleText = styled.p`
  color: #fff;
  margin: 0;
  ${p_14_medium};
`;

export const TooltipInfoText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;
