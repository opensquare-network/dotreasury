import "semantic-ui-css/semantic.min.css";
import "../../site/src/styles/override-semantic-ui-css.css";
import Footer from "../../site/src/pages/Footer";
import Header from "./components/header";
import Hero from "./components/hero";
import Overview from "./components/overview";
import Ecosystem from "./components/ecosystem";
import Providers from "./providers";

function App() {
  return (
    <Providers>
      <Header />
      <Hero />
      <Ecosystem />
      <Overview />
      <Footer />

      <div className="absolute top-0 max-h-screen overflow-hidden -z-10 pointer-events-none">
        <img src="/bg-gradient.svg" />
      </div>
    </Providers>
  );
}

export default App;
