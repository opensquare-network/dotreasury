import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "../services/websocket";

import Container from "../components/Container";
import { Wrapper, PageWrapper } from "./components";
import ScrollToTop from "../components/ScrollToTop";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import Tips from "../pages/Tips";
import Proposals from "../pages/Proposals";
import Bounties from "../pages/Bounties";
import Burnt from "../pages/Burnt";
import TipDetail from "../pages/TipDetail";
import ProposalDetail from "../pages/ProposalDetail";
import BountyDetail from "../pages/BountyDetail";
import Overview from "../pages/Overview";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import TreasurySlash from "../pages/TreasurySlash";
import DemocracySlash from "../pages/DemocracySlash";
import IdentitySlash from "../pages/IdentitySlash";
import StakingSlash from "../pages/StakingSlash";
import ElectionPhragmenSlash from "../pages/ElectionPhragmenSlash";
import Inflation from "../pages/Inflation";
import OthersIncome from "../pages/OthersIncome";

import { usePreload } from "../utils/hooks";

export default function App() {
  usePreload();
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
              <Route exact path="/proposals" component={Proposals} />
              <Route exact path="/bounties" component={Bounties} />
              <Route exact path="/tips/:tipId" component={TipDetail} />
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
              <Route exact path="/burnt" component={Burnt} />
              <Route exact path="/projects" component={Projects} />
              <Route exact path="/projects/:projectIndex" component={ProjectDetail} />
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
              <Route exact path="/income/others" component={OthersIncome} />
              <Redirect to="/" />
            </Switch>
          </Container>
        </PageWrapper>
        <Footer />
      </Wrapper>
    </Router>
  );
}
