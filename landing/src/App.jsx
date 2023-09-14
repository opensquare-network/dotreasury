import "semantic-ui-css/semantic.min.css";
import "../../site/src/styles/override-semantic-ui-css.css";
import Footer from "../../site/src/pages/Footer";
import { ThemeProvider } from "../../site/src/context/theme";
import Header from "./components/header";
import Hero from "./components/hero";
import TreasuryOverview from "./components/treasuryOverview";
import Ecosystem from "./components/ecosystem";

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Hero />
      <Ecosystem />
      <TreasuryOverview />
      <Footer />

      <div className="absolute top-0 max-h-screen overflow-hidden -z-10 pointer-events-none">
        <img src="/bg-gradient.svg" />
      </div>
    </ThemeProvider>
  );
}

export default App;
