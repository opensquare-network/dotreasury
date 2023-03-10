import styled from "styled-components";
import { ReactComponent as LinkSVG } from "./link.svg";

const Icon = styled(LinkSVG)`
  cursor: pointer;
`;

export default function JumpToLink({ href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon />
    </a>
  );
}
