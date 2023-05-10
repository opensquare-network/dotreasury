import styled from "styled-components";
import ExternalLink from "../../components/ExternalLink";
import IconMask from "../../components/Icon/Mask";

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
      <IconMask
        src="/imgs/caret-up-right.svg"
        color="textTertiary"
        size={16}
        style={{ marginLeft: 4 }}
      />
    </LinkTitle>
  );
}
