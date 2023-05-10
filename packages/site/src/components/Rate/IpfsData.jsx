import styled from "styled-components";
import ExternalLink from "../ExternalLink";
import ImageWithDark from "../ImageWithDark";
import {
  block,
  hidden,
  inline_flex,
  items_center,
  relative,
  w,
} from "../../styles/tailwindcss";

const Wrapper = styled.span`
  ${inline_flex};
  ${items_center};
  ${relative};
  top: 1px;
  img {
    ${w(16)};
  }
  .inactive {
    ${block};
  }
  .active {
    ${hidden};
  }
  &:hover {
    .inactive {
      ${hidden};
    }
    .active {
      ${block};
    }
  }
`;

export default function IpfsData({ url }) {
  return (
    <Wrapper>
      {!url ? (
        <ImageWithDark src="/imgs/ipfs-logo-inactive.svg" />
      ) : (
        <ExternalLink href={url}>
          <ImageWithDark className="active" src="/imgs/ipfs-logo.svg" />
          <ImageWithDark
            className="inactive"
            src="/imgs/ipfs-logo-inactive.svg"
          />
        </ExternalLink>
      )}
    </Wrapper>
  );
}
