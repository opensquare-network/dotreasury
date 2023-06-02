import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { Label } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { openGovProposalCountSelector, totalProposalCountSelector } from "../../store/reducers/overviewSlice";
import { NavItem, NavLabel, NavWrapper } from "../../components/Nav/styled";
import { chainSelector } from "../../store/reducers/chainSlice";

function Nav() {
  const chain = useSelector(chainSelector);
  const history = useHistory();
  const [active, setActive] = useState("All");
  const totalProposalCount = useSelector(totalProposalCountSelector);
  const openGovProposalCount = useSelector(openGovProposalCountSelector);
  const gov1ProposalCount = totalProposalCount - openGovProposalCount;

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (active === "Gov1") {
      searchParams.set("tab", "gov1");
    } else if (active === "OpenGov") {
      searchParams.set("tab", "opengov");
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
  ];

  if (chain === "kusama") {
    items.push({
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
    });
  }

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
