import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import Container from "../components/Container";
import { Wrapper, PageWrapper } from "./components";
import ScrollToTop from "../components/ScrollToTop";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import TipsRedirect from "../pages/Tips/TipsRedirect";
import ProposalsRedirect from "../pages/Proposals/ProposalsRedirect";
import Bounties from "../pages/Bounties";
import ChildBounties from "../pages/ChildBounties";
import Burnt from "../pages/Burnt";
import ProposalDetail from "../pages/ProposalDetail";
import ChildBountyDetail from "../pages/BountyDetail/ChildBountyDetail/index";
import Overview from "../pages/Overview";
import ProjectsRedirect from "../pages/Projects/ProjectsRedirect";
import ProjectDetail from "../pages/ProjectDetail";
import Toast from "../pages/Toast";
import TreasurySlash from "../pages/TreasurySlash";
import DemocracySlash from "../pages/DemocracySlash";
import IdentitySlash from "../pages/IdentitySlash";
import StakingSlash from "../pages/StakingSlash";
import ElectionPhragmenSlash from "../pages/ElectionPhragmenSlash";
import OthersIncome from "../pages/OthersIncome";
import TransfersSlash from "../pages/TransfersSlash";
import ProposalBeneficiaries from "../pages/ProposalBeneficiaries";
import BeneficiariesRedirect from "../pages/Beneficiaries/BeneficiariesRedirect";
import UsersDetail from "../pages/UsersDetail";
import BeneficiariesDetail from "../pages/BeneficiariesDetail";
import Referenda from "../pages/Referenda";

import { usePreload } from "../utils/hooks";
import ReferendaSlash from "../pages/ReferendaSlash";
import FellowshipReferendaSlash from "../pages/FellowshipReferendaSlash";
import { isPolkadot } from "../utils/chains";
import Spends from "../pages/Spends";
import BountyDetailRedirect from "../pages/BountyDetail/BountyDetailRedirect";

export default function App() {
  usePreload();

  return (
    <HashRouter>
      <Wrapper>
        <Header />
        <PageWrapper>
          <Container>
            <ScrollToTop />
            <Switch>
              <Route exact path="/" component={Overview} />

              <Route exact path="/tips" component={TipsRedirect} />
              <Route exact path="/referenda" component={Referenda} />
              <Route exact path="/spends" component={Spends} />

              <Route exact path="/proposals" component={ProposalsRedirect} />
              <Route exact path="/bounties" component={Bounties} />
              <Route exact path="/child-bounties" component={ChildBounties} />
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
                component={BountyDetailRedirect}
              />
              <Route
                exact
                path="/child-bounties/:bountyIndex"
                component={ChildBountyDetail}
              />
              <Route exact path="/burnt" component={Burnt} />
              {isPolkadot && (
                <Route exact path="/projects" component={ProjectsRedirect} />
              )}
              <Route
                exact
                path="/projects/:projectId"
                component={ProjectDetail}
              />
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
              <Route
                exact
                path="/beneficiaries"
                component={BeneficiariesRedirect}
              />
              <Route
                exact
                path="/beneficiaries/:address"
                component={BeneficiariesDetail}
              />
              <Route
                exact
                path="/beneficiaries/:address/:tableTab?"
                component={BeneficiariesDetail}
              />
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
    </HashRouter>
  );
}
