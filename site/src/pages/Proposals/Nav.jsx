import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { Label } from "semantic-ui-react";
import { useSelector } from "react-redux";
import {
  openGovProposalCountSelector,
  totalProposalCountSelector,
  failedProposalCountSelector,
} from "../../store/reducers/overviewSlice";
import { NavItem, NavLabel, NavWrapper } from "../../components/Nav/styled";
import { useQuery } from "../../utils/hooks";
import { currentChainSettings } from "../../utils/chains";

function Nav() {
  const history = useHistory();
  const query = useQuery();
  const tab = query.get("tab");
  const defaultActiveTab =
    tab === "gov1"
      ? "Gov1"
      : tab === "opengov"
      ? "OpenGov"
      : tab === "failed"
      ? "Failed"
      : "All";
  const [active, setActive] = useState(defaultActiveTab);
  const totalProposalCount = useSelector(totalProposalCountSelector);
  const openGovProposalCount = useSelector(openGovProposalCountSelector);
  const failedProposalCount = useSelector(failedProposalCountSelector);
  const gov1ProposalCount = totalProposalCount - openGovProposalCount;

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (active === "Gov1") {
      searchParams.set("tab", "gov1");
    } else if (active === "OpenGov") {
      searchParams.set("tab", "opengov");
    } else if (active === "Failed") {
      searchParams.set("tab", "failed");
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

  if (currentChainSettings.supportOpenGov) {
    items.push(
      {
        name: "OpenGov",
        label: (
          <NavLabel>
            <span>OpenGov</span>
            <Label>{openGovProposalCount}</Label>
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
        name: "Failed",
        label: (
          <NavLabel>
            <span>Failed</span>
            <Label>{failedProposalCount || 50}</Label>
          </NavLabel>
        ),
      },
    );
  }

  return (
    <NavWrapper>
      {items.map((item, index) => (
        <NavItem
          key={index}
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
