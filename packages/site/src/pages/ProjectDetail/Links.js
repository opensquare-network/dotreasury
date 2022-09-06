import styled from "styled-components";
import { getLinkNameAndSrc } from "../../utils";
import { Image } from "semantic-ui-react";
import ExternalLink from "../../components/ExternalLink";
import { p_14_medium } from "../../styles/text";

const LinksWrapper = styled.ul`
  list-style: none;
  display: flex;
  gap: 4px;
`;

const LinkWrapper = styled.span`
  background-color: #fafafa;
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;

  img {
    display: inline-block !important;
    margin-right: 4px;
    width: 16.67px;
    height: 16.67px;
  }
`;

const LinkText = styled.span`
  color: rgba(0, 0, 0, 0.9);
  ${p_14_medium};
`;

export default function Links({ links }) {
  return (
    <LinksWrapper>
      {links?.map?.((link, i) => (
        <li key={i}>
          <Link link={link} />
        </li>
      ))}
    </LinksWrapper>
  );
}

function Link({ link }) {
  const [, src] = getLinkNameAndSrc(link.link);

  return (
    <ExternalLink href={link.link}>
      <LinkWrapper>
        <Image src={src} />
        <LinkText>{link.description}</LinkText>
      </LinkWrapper>
    </ExternalLink>
  );
}
