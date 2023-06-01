import styled, { css } from "styled-components";
import Text from "../../components/Text";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { Label } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { openGovProposalCountSelector, totalProposalCountSelector } from "../../store/reducers/overviewSlice";

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

function Nav() {
  const history = useHistory();
  const [active, setActive] = useState("All");
  const totalProposalCount = useSelector(totalProposalCountSelector);
  const openGovProposalCount = useSelector(openGovProposalCountSelector);
  const gov1ProposalCount = totalProposalCount - openGovProposalCount;

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
      name: "All",
      label: (
        <NavLabel>
          <span>All</span>
          <Label>{totalProposalCount}</Label>
        </NavLabel>
      ),

    },
    {
      name: "Gov1",
      label: (
        <NavLabel>
          <span>Gov1</span>
          <Label>{gov1ProposalCount}</Label>
        </NavLabel>
      ),
    },
    {
      name: "OpenGov",
      label: (
        <NavLabel>
          <span>OpenGov</span>
          <Label>{openGovProposalCount}</Label>
        </NavLabel>
      ),
    },
  ];

  return (
    <NavWrapper>
      {items.map((item) => (
        <NavItem
          key={item.to}
          active={item.name === active}
          onClick={() => setActive(item.name)}
        >
          {item.label}
        </NavItem>
      ))}
    </NavWrapper>
  );
}

export default Nav;
