import { Fragment } from "react";
import { Image } from "semantic-ui-react";
import styled from "styled-components";
import { TEXT_DARK_ACCESSORY, TEXT_DARK_MAJOR } from "../constants";
import { p_14_normal } from "../styles/text";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  ${p_14_normal};
`;

const PlusWrapper = styled.span`
  margin: 0 4px;
  color: ${TEXT_DARK_ACCESSORY};
  &:first-child {
    display: none;
  }
  &:last-child {
    display: none;
  }
`;

const SymbolWrapper = styled.span`
  color: ${TEXT_DARK_MAJOR};
  margin-right: 4px;
`;

/**
 * @description Count proposals, bounties and tips
 * @example 2P(roposals) + 4T(ips) + 1B(ounties) + 2b(child bounties)
 */
export default function ProposalsCount({
  proposals,
  bounties,
  tips,
  childBounties,
  showZero = false,
}) {
  const symbols = [
    {
      count: proposals,
      icon: "/imgs/symbol-proposals.svg",
    },
    {
      count: tips,
      icon: "/imgs/symbol-tips.svg",
    },
    {
      count: bounties,
      icon: "/imgs/symbol-bounties.svg",
    },
    {
      count: childBounties,
      icon: "/imgs/symbol-child-bounties.svg",
    },
  ];

  return (
    <Wrapper>
      {symbols.map(
        (i, k) =>
          (i.count || showZero) && (
            <Fragment key={k}>
              <SymbolWrapper>{i.count}</SymbolWrapper>
              <Image src={i.icon} />
              <PlusWrapper>+</PlusWrapper>
            </Fragment>
          )
      )}
    </Wrapper>
  );
}
