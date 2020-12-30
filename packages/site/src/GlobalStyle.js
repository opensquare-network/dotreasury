import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: #F5F5F5;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    font-family: 'Inter', 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }
  
  ol, ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .ui.primary.button, .ui.primary.buttons .button {
    background: #DF405D;
    
    &:hover, &:active, &:focus {
      background: #DF405D;
    }
    
    &:focus {
      background: #DF405D;
    }
  }
  
  .ui.input.focus>input, .ui.input>input:focus {
    border-color: #DF405D;
  }
  
  .ui.input.error>input:focus {
    border-color: #DF405D;
  }
  
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
`;

export default GlobalStyle;
