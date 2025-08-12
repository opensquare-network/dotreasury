import { Fragment } from "react";
import styled from "styled-components";
import { p_14_normal } from "../styles/text";
import ImageWithDark from "./ImageWithDark";
import Tooltip from "./Tooltip";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  ${p_14_normal};
`;

const PlusWrapper = styled.span`
  margin: 0 4px;
  color: var(--textTertiary);
  &:first-child {
    display: none;
  }
  &:last-child {
    display: none;
  }
`;

const SymbolWrapper = styled.span`
  color: var(--textPrimary);
  margin-right: 4px;
`;

/**
 * @description Count proposals, bounties and tips
 * @example 2P(roposals) + 4T(ips) + 1B(ounties) + 2b(child bounties)
 */
export default function ProposalsCount({
  spends,
  proposals,
  bounties,
  tips,
  childBounties,
  showZero = false,
}) {
  const symbols = [
    {
      count: spends,
      icon: "/imgs/symbol-spends.svg",
      title: "Treasury spend",
    },
    {
      count: proposals,
      icon: "/imgs/symbol-proposals.svg",
      title: "Treasury proposal",
    },
    {
      count: tips,
      icon: "/imgs/symbol-tips.svg",
      title: "Tip",
    },
    {
      count: bounties,
      icon: "/imgs/symbol-bounties.svg",
      title: "Parent bounty",
    },
    {
      count: childBounties,
      icon: "/imgs/symbol-child-bounties.svg",
      title: "Child bounty",
    },
  ];

  return (
    <Wrapper>
      {symbols.map(
        (i, k) =>
          (i.count || showZero) && (
            <Fragment key={k}>
              <SymbolWrapper>{i.count}</SymbolWrapper>
              <Tooltip tooltipContent={i.title}>
                <ImageWithDark src={i.icon} />
              </Tooltip>
              <PlusWrapper>+</PlusWrapper>
            </Fragment>
          ),
      )}
    </Wrapper>
  );
}
