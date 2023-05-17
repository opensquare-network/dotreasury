import styled from "styled-components";
import { ReactComponent as LinkSVG } from "./link.svg";

const Icon = styled(LinkSVG)`
  cursor: pointer;
  g {
    path {
      stroke: var(--textTertiary);
    }
  }

  rect {
    stroke: var(--textDisable);
  }
`;

export default function JumpToLink({ href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon />
    </a>
  );
}
