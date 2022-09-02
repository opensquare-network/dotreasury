import styled from "styled-components";

const popperTriangleWidth = 6;

export const CountDownWrapper = styled.div`
  display: inline-flex;
`;

export const SVG = styled.svg`
  g {
    path:first-child {
      fill: ${(p) => p.foregroundColor};
    }
    path:last-child {
      fill: ${(p) => p.backgroundColor};
    }
  }
`;

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
