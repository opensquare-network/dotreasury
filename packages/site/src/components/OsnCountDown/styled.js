import styled from "styled-components";
import { text_light_major, text_light_minor } from "./styles";
import { p_12_normal, p_14_medium } from "./styles";

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
    width: 8px;
    height: 8px;
    background: inherit;
  }

  &::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
  }
`;

export const PopperContainer = styled.div`
  background: #333;
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  font-size: 13px;
  border-radius: 4px;
  display: none;

  &[data-show="true"] {
    display: block;
  }

  &[data-popper-placement^="top"] > ${PopperArrow} {
    bottom: -4px;
  }

  &[data-popper-placement^="bottom"] > ${PopperArrow} {
    top: -4px;
  }

  &[data-popper-placement^="left"] > ${PopperArrow} {
    right: -4px;
  }

  &[data-popper-placement^="right"] > ${PopperArrow} {
    left: -4px;
  }
`;

export const PopperInfoDiffHeight = styled.p`
  ${p_14_medium};
  color: ${text_light_major};
  margin: 0;
`;
export const PopperInfoHeight = styled.p`
  ${p_12_normal};
  color: ${text_light_minor};
  margin: 0;
`;
