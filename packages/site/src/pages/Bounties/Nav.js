import styled, { css } from "styled-components";
import Text from "../../components/Text";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

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

function Nav({ active = "" }) {
  const symbol = useSelector(chainSymbolSelector);
  const name = symbol.toLowerCase();

  const items = [
    {
      label: "Bounties",
      to: `/${name}/bounties`,
    },
    {
      label: "Child Bounties",
      to: `/${name}/child-bounties`,
    },
  ];

  return (
    <NavWrapper>
      {items.map((item) => (
        <NavItem key={item.to} active={item.label === active}>
          <NavLink to={item.to}>{item.label}</NavLink>
        </NavItem>
      ))}
    </NavWrapper>
  );
}

export default Nav;
