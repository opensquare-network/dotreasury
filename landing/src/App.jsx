import "semantic-ui-css/semantic.min.css";
import "../../site/src/styles/override-semantic-ui-css.css";
import Footer from "../../site/src/pages/Footer";
import Header from "./components/header";
import Hero from "./components/hero";
import Overview from "./components/overview";
import Ecosystem from "./components/ecosystem";
import Providers from "./providers";
import { cn } from "./utils";

function App() {
  return (
    <Providers>
      <Header />
      <Hero />
      <Ecosystem />
      <Overview />
      <Footer />

      <div
        className={cn(
          "absolute top-0 left-0 right-0 max-h-screen min-h-[720px] overflow-hidden -z-10 pointer-events-none",
          "bg-no-repeat bg-cover bg-center",
        )}
        style={{ backgroundImage: "url(/bg-gradient.svg)" }}
      />
    </Providers>
  );
}

export default App;
