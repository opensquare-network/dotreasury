import { Fragment } from "react";
import { Image } from "semantic-ui-react";
import styled from "styled-components";
import { TEXT_DARK_ACCESSORY, TEXT_DARK_MAJOR } from "../constants";
import { p_14_normal } from "../styles/text";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
 * @example 2P(roposals) + 1B(ounties) + 4T(ips)
 */
export default function ProposalsCount({ proposals, bounties, tips }) {
  const symbols = [];
  const makeSymbol = (count, symbolIconUrl) => {
    return (
      <Fragment key={symbolIconUrl}>
        <SymbolWrapper>{count}</SymbolWrapper>
        <Image src={symbolIconUrl} />
        <PlusWrapper>+</PlusWrapper>
      </Fragment>
    );
  };

  if (proposals) {
    symbols.push(makeSymbol(proposals, "/imgs/symbol-proposals.svg"));
  }
  if (bounties) {
    symbols.push(makeSymbol(bounties, "/imgs/symbol-bounties.svg"));
  }
  if (tips) {
    symbols.push(makeSymbol(tips, "/imgs/symbol-tips.svg"));
  }

  return <Wrapper>{symbols}</Wrapper>;
}
