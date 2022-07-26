import styled, { css } from "styled-components";

import { TEXT_DARK_MAJOR } from "../../constants";

const TextWrapper = styled.div`
  word-wrap: break-word;
  word-break: break-word;
  ${(p) =>{
    if(p.maxWidth){
      return css`
        word-break: break-all;
        max-width: ${p.maxWidth}px;
      `
    }else{
      return css`
        min-width: 480px;
      `
    }
  }}
  font-family: "Inter",serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: ${TEXT_DARK_MAJOR};
  margin: 0;
`;

export default TextWrapper;
