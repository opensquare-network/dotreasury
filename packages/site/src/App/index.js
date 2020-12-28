import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Container from "../components/Container";
import { PageWrapper } from "./components";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import Tips from "../pages/Tips";
import Proposals from "../pages/Proposals";
import Bounties from "../pages/Bounties";
import Detail from "../pages/Detail";

export default function App() {
  return (
    <Router>
      <Header />
      <PageWrapper>
        <Container>
          <Switch>
            <Route exact path="/" component={Tips} />
            <Route exact path="/tips" component={Tips} />
            <Route exact path="/proposals" component={Proposals} />
            <Route exact path="/bounties" component={Bounties} />
            <Route exact path="/detail" component={Detail} />
            <Redirect to="/" />
          </Switch>
        </Container>
      </PageWrapper>
      <Footer />
    </Router>
  );
}
