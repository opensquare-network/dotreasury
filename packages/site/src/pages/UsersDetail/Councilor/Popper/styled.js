import styled from "styled-components";

const popperTriangleWidth = 6;

export const PopperArrow = styled.div`
  visibility: hidden;

  &,
  &::before {
    position: absolute;
    border: ${popperTriangleWidth}px solid transparent;
    left: 50%;
    bottom: -9px;
    transform: translateX(-50%);
    border-top-color: rgba(0, 0, 0, 0.72);
  }

  &::before {
    visibility: visible;
    content: "";
  }
`;

export const PopperContainer = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.72);
  color: white;
  padding: 8px;
  border-radius: 4px;
  visibility: hidden;

  ${PopperArrow} {
    display: none;
  }

  &[data-show="true"] {
    visibility: visible;

    ${PopperArrow} {
      display: block;
    }
  }
`;
