import "semantic-ui-css/semantic.min.css";
import "../../site/src/styles/override-semantic-ui-css.css";
import Footer from "../../site/src/pages/Footer";
import { ThemeProvider } from "../../site/src/context/theme";
import Header from "./components/header";

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
