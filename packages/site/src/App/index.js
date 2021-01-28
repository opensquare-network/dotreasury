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
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserSetting from "../pages/UserSetting";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";

export default function App() {
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
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/settings" component={UserSetting} />
              <Route exact path="/forget" component={ForgetPassword} />
              <Route exact path="/resetpassword" component={ResetPassword} />
              <Redirect to="/" />
            </Switch>
          </Container>
        </PageWrapper>
        <Footer />
      </Wrapper>
    </Router>
  );
}
