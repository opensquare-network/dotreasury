import styled, { css } from "styled-components";
import { p_14_normal } from "../../styles/text";
import ExternalLink from "../../components/ExternalLink";
import ImageWithDark from "../../components/ImageWithDark";
import { smcss } from "@osn/common";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
  color: var(--textSecondary);
  ${smcss(css`
    flex-direction: column;
  `)}
  ${p_14_normal};
`;

const FundedByWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 16px;
  flex-wrap: wrap;
`;

const fundedBy = [
  {
    name: "Kusama",
    link: "https://kusama.network",
    img: "/imgs/kusama-treasury-logo.svg",
  },
  {
    name: "Polkadot",
    link: "https://polkadot.network",
    img: "/imgs/polkadot-treasury-logo.svg",
  },
];

export default function FooterFundedBy({ className = "" }) {
  return (
    <Wrapper className={className}>
      Funded by
      <FundedByWrapper>
        {fundedBy.map((item) => (
          <ExternalLink key={item.name} href={item.link}>
            <ImageWithDark src={item.img} />
          </ExternalLink>
        ))}
      </FundedByWrapper>
    </Wrapper>
  );
}
