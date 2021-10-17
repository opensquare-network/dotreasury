import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "semantic-ui-css/semantic.min.css";

import App from "./App";
import store from "./store";
import GlobalStyle from "./GlobalStyle";

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <Provider store={store}>
      {/*<Maintenance />*/}
      <App />
    </Provider>
  </React.Fragment>,
  document.getElementById("root")
);

// deploy trigger 23
