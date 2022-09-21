import styled from "styled-components";

const popperTriangleWidth = 6;

export const PopperArrow = styled.div`
  visibility: hidden;

  &,
  &::before {
    position: absolute;
    border: ${popperTriangleWidth}px solid transparent;
    left: -${popperTriangleWidth}px;
    border-top-color: rgba(0, 0, 0, 0.72);
  }

  &::before {
    visibility: visible;
    content: "";
  }
`;

export const PopperContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.72);
  color: white;
  font-weight: bold;
  padding: 8px;
  border-radius: 4px;
  display: none;

  &[data-show="true"] {
    display: block;
  }

  &[data-popper-placement^="top"] > ${PopperArrow} {
    bottom: -${popperTriangleWidth}px;
  }

  &[data-popper-placement^="bottom"] > ${PopperArrow} {
    top: -${popperTriangleWidth * 3}px;
    &::before {
      transform: rotate(180deg);
    }
  }
`;

export const TooltipTitleText = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #fff;
  margin: 0;
`;

export const TooltipInfoText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;
