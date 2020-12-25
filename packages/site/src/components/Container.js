import styled from "styled-components";

const Container = styled.div`
  box-sizing: border-box;
  height: 100%;
  overflow-x: visible;
  overflow-y: visible;

  @media screen and (min-width: 1128px) {
    width: 1128px;
    margin: 0 auto;
  }

  @media screen and (max-width: 1140px) {
    margin: 0 16px;
    width: calc(100wd - 32px);
  }
`;

export default Container;
