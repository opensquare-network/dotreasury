import styled from "styled-components";

export const PageWrapper = styled.section`
  padding: 20px 0;
  height: calc(100vh - 200px);
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
