import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { connect } from "../services/websocket";

import Container from "../components/Container";
import { Wrapper, PageWrapper } from "./components";
import ScrollToTop from "../components/ScrollToTop";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import Tips from "../pages/Tips";
import Proposals from "../pages/Proposals";
import Bounties from "../pages/Bounties";
import ChildBounties from "../pages/ChildBounties";
import Burnt from "../pages/Burnt";
import TipDetail from "../pages/TipDetail";
import TipFinders from "../pages/TipFinders";
import ProposalDetail from "../pages/ProposalDetail";
import BountyDetail from "../pages/BountyDetail";
import ChildBountyDetail from "../pages/BountyDetail/ChildBountyDetail/index";
import Overview from "../pages/Overview";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Toast from "../pages/Toast";
import TreasurySlash from "../pages/TreasurySlash";
import DemocracySlash from "../pages/DemocracySlash";
import IdentitySlash from "../pages/IdentitySlash";
import StakingSlash from "../pages/StakingSlash";
import ElectionPhragmenSlash from "../pages/ElectionPhragmenSlash";
import Inflation from "../pages/Inflation";
import OthersIncome from "../pages/OthersIncome";
import Transfers from "../pages/Transfers";
import TransfersSlash from "../pages/TransfersSlash";
import ProposalBeneficiaries from "../pages/ProposalBeneficiaries";
import Users from "../pages/Users";
import UsersDetail from "../pages/UsersDetail";
import Referenda from "../pages/Referenda";

import { usePreload } from "../utils/hooks";
import ReferendaSlash from "../pages/ReferendaSlash";
import FellowshipReferendaSlash from "../pages/FellowshipReferendaSlash";

export default function App() {
  usePreload();

  connect();

  const Router =
    import.meta.env.VITE_APP_ROUTER_TYPE === "HashRouter"
      ? HashRouter
      : BrowserRouter;

  return (
    <Router>
      <Wrapper>
        <Header />
        <PageWrapper>
          <Container>
            <ScrollToTop />
            <Switch>
              <Route exact path="/" component={Overview} />
              <Route exact path="/tips" component={Tips} />
              <Route exact path="/referenda" component={Referenda} />
              <Route exact path="/proposals" component={Proposals} />
              <Route exact path="/bounties" component={Bounties} />
              <Route exact path="/child-bounties" component={ChildBounties} />
              <Route exact path="/transfers" component={Transfers} />
              <Route exact path="/tip-finders" component={TipFinders} />
              <Route exact path="/tips/:tipId" component={TipDetail} />
              <Route
                exact
                path="/proposal-beneficiaries"
                component={ProposalBeneficiaries}
              />
              <Route
                exact
                path="/proposals/:proposalIndex"
                component={ProposalDetail}
              />
              <Route
                exact
                path="/bounties/:bountyIndex"
                component={BountyDetail}
              />
              <Route
                exact
                path="/child-bounties/:bountyIndex"
                component={ChildBountyDetail}
              />
              <Route exact path="/burnt" component={Burnt} />
              <Route exact path="/projects" component={Projects} />
              <Route
                exact
                path="/projects/:projectId"
                component={ProjectDetail}
              />
              <Route exact path="/income" component={Inflation} />
              <Route
                exact
                path="/income/slash/treasury"
                component={TreasurySlash}
              />
              <Route
                exact
                path="/income/slash/democracy"
                component={DemocracySlash}
              />
              <Route
                exact
                path="/income/slash/identity"
                component={IdentitySlash}
              />
              <Route
                exact
                path="/income/slash/staking"
                component={StakingSlash}
              />
              <Route
                exact
                path="/income/slash/electionphragmen"
                component={ElectionPhragmenSlash}
              />
              <Route
                exact
                path="/income/slash/referenda"
                component={ReferendaSlash}
              />
              <Route
                exact
                path="/income/slash/fellowship-referenda"
                component={FellowshipReferendaSlash}
              />
              <Route
                exact
                path="/income/transfers"
                component={TransfersSlash}
              />
              <Route exact path="/income/others" component={OthersIncome} />
              <Route exact path="/users" component={Users} />
              <Route exact path="/users/:address" component={UsersDetail} />
              <Route
                exact
                path="/users/:address/:role/:tableTab?"
                component={UsersDetail}
              />
              <Redirect to="/" />
            </Switch>
          </Container>
        </PageWrapper>
        <Footer />
        <Toast />
      </Wrapper>
    </Router>
  );
}
