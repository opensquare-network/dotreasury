import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "semantic-ui-css/semantic.min.css";
import "./styles/override-semantic-ui-css.css";

import App from "./App";
import store from "./store";
import GlobalStyle from "./GlobalStyle";
import { GlobalProvider } from "./context";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.Fragment>
    <GlobalStyle />
    <Provider store={store}>
      {/*<Maintenance />*/}
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </Provider>
  </React.Fragment>,
);

// deploy trigger 25
