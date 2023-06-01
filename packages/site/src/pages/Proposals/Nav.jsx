import styled, { css } from "styled-components";
import Text from "../../components/Text";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";

const NavWrapper = styled.div`
  display: flex;
  gap: 32px;
`;

const NavItem = styled(Text)`
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;

  color: var(--textTertiary);

  :hover {
    color: var(--textSecondary);
  }

  ${(p) =>
    p.active &&
    css`
      color: var(--textPrimary) !important;
    `}
`;

function Nav() {
  const history = useHistory();
  const [active, setActive] = useState("All");

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (active === "Gov1") {
      searchParams.set("gov", "1");
    } else if (active === "OpenGov") {
      searchParams.set("gov", "2");
    } else {
      searchParams.delete("gov");
    }

    history.push({ search: searchParams.toString() });
  }, [history, active]);

  const items = [
    {
      label: "All",
    },
    {
      label: "Gov1",
    },
    {
      label: "OpenGov",
    },
  ];

  return (
    <NavWrapper>
      {items.map((item) => (
        <NavItem
          key={item.to}
          active={item.label === active}
          onClick={() => setActive(item.label)}
        >
          {item.label}
        </NavItem>
      ))}
    </NavWrapper>
  );
}

export default Nav;
