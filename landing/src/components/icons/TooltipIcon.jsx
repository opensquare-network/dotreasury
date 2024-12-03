import { useThemeMode } from "@site/src/context/theme";
import styled from "styled-components";
import { ReactComponent as InfoSVG } from "./info.svg";

const Wrapper = styled.div`
  display: inline-flex;
  svg path {
    fill: ${({ themeMode }) => (themeMode === "dark" ? "white" : "black")};
  }
`;

export default function TooltipIcon() {
  const [themeMode] = useThemeMode();
  return (
    <Wrapper themeMode={themeMode}>
      <InfoSVG />
    </Wrapper>
  );
}
