import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: visible;

  @media screen and (min-width: 1128px) {
    width: 1128px;
    margin: 0 auto;
  }

  @media screen and (max-width: 1140px) {
    padding: 0 16px;
    width: 100%;
  }
`;

export default Container;
