import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "../services/websocket";

import Container from "../components/Container";
import { PageWrapper } from "./components";
import ScrollToTop from "../components/ScrollToTop";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import Tips from "../pages/Tips";
import Proposals from "../pages/Proposals";
import Bounties from "../pages/Bounties";
import TipDetail from "../pages/TipDetail";
import ProposalDetail from "../pages/ProposalDetail";
import BountyDetail from "../pages/BountyDetail";
import Overview from "../pages/Overview";

export default function App() {
  return (
    <Router>
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
            <Route exact path="/proposals/:proposalIndex" component={ProposalDetail} />
            <Route exact path="/bounties/:bountyIndex" component={BountyDetail} />
            <Redirect to="/" />
          </Switch>
        </Container>
      </PageWrapper>
      <Footer />
    </Router>
  );
}
