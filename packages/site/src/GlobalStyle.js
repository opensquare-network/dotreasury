import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: #FBFBFB;
    * {
      box-sizing: border-box !important;
    }
  }
  
  #root {
    display: flex;
    flex-direction: column;
    font-family: 'Inter', 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }
  
  ol:not(.mde-preview-content *),
  ul:not(.mde-preview-content *),
  li:not(.mde-preview-content *) {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  /* .ui.input input:hover,
  .ui.form input:hover,
  .ui.input input:focus,
  .ui.form input:focus {
    border-color: #CCCCCC !important;
  } */
  
  .ant-table.ant-table-small {
    font-size: 13px;
  }
  
  a {
    color: #4183c4;
    &:hover {
      color: #40a9ff;
    }
  }
  
  .ui.table td {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  
  pre {
    background-color: whitesmoke;
    color: #4a4a4a;
    font-size: 0.875em;
    overflow-x: auto;
    padding: 1.25rem 1.5rem;
    white-space: pre;
    word-wrap: normal;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  div.modals.dimmer {
    background-color: rgba(0, 0, 0, .48) !important;
  }

  .ui.selection.dropdown .menu>.item {
    padding: 8px !important;
  }
`;

export default GlobalStyle;
