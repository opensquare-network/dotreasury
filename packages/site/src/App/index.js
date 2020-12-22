import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Header from "../pages/Header";
import Footer from "../pages/Footer";
import Tips from "../pages/Tips";
import Container from "../components/Container";
import { PageWrapper } from "./components";

export default function App() {
  return (
    <Router>
      <Header />
      <PageWrapper>
        <Container>
          <Switch>
            <Route exact path="/" component={Tips} />
            <Redirect to="/" />
          </Switch>
        </Container>
      </PageWrapper>
      <Footer />
    </Router>
  );
}
