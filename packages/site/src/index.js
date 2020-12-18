import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store'
import { Provider } from 'react-redux'
import GlobalStyle from "./GlobalStyle";

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <Provider store={store}>
      <App />
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
);

