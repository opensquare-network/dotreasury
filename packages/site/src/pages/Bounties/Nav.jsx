import styled, { css } from "styled-components";
import Text from "../../components/Text";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { Label } from "semantic-ui-react";
import { totalBountyCountSelector, totalChildBountyCountSelector } from "../../store/reducers/overviewSlice";

const NavWrapper = styled.div`
  display: flex;
  gap: 32px;
`;

const NavItem = styled(Text)`
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;

  a {
    color: var(--textTertiary);

    :hover {
      color: var(--textSecondary);
    }

    ${(p) =>
      p.active &&
      css`
        color: var(--textPrimary) !important;
      `}
  }
`;

const NavLabel = styled.div`
  display: flex;
  align-items: center;

  div.ui.label {
    background: var(--secondary) !important;
    height: 20px !important;
    padding: 0 8px !important;
    line-height: 20px !important;
    border-radius: 10px !important;
    margin-left: 8px !important;
    color: var(--primary) !important;
    font-weight: 400;
  }
`;

function Nav({ active = "" }) {
  const symbol = useSelector(chainSymbolSelector);
  const name = symbol.toLowerCase();
  const totalBountyCount = useSelector(totalBountyCountSelector);
  const totalChildBountyCount = useSelector(totalChildBountyCountSelector);

  const items = [
    {
      name: "Bounties",
      label: (
        <NavLabel>
          <span>Bounties</span>
          <Label>{totalBountyCount}</Label>
        </NavLabel>
      ),
      to: `/${name}/bounties`,
    },
    {
      name: "Child Bounties",
      label: (
        <NavLabel>
          <span>Child Bounties</span>
          <Label>{totalChildBountyCount}</Label>
        </NavLabel>
      ),
      to: `/${name}/child-bounties`,
    },
  ];

  return (
    <NavWrapper>
      {items.map((item) => (
        <NavItem key={item.to} active={item.name === active}>
          <NavLink to={item.to}>{item.label}</NavLink>
        </NavItem>
      ))}
    </NavWrapper>
  );
}

export default Nav;
