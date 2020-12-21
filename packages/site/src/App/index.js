import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Header from "../pages/Header";
import Footer from "../pages/Footer";

import TestA from "./TestA";
import TestB from "./TestB";

export default function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={TestA} />
        <Route exact path="/testb" component={TestB} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </Router>
  );
}
