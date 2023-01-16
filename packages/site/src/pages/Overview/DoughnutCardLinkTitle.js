import styled from "styled-components";
import ExternalLink from "../../components/ExternalLink";

const LinkTitle = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  color: inherit;

  &:hover {
    color: inherit;
    text-decoration: underline;
  }
`;

export default function DoughnutCardLinkTitle({ children, href = "" }) {
  return (
    <LinkTitle href={href}>
      {children}
      <img src="/imgs/caret-up-right.svg" alt="" />
    </LinkTitle>
  );
}
