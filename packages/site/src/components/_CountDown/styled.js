import styled from "styled-components";

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
