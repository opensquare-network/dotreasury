import styled from "styled-components";

const Wrapper = styled.div`
  display: block;
  max-height: 300px;

  border: 1px solid var(--neutral300);
  border-radius: 4px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: block;
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--neutral500);
    border-radius: 3px;
  }
`;

const Loading = styled.div`
  display: flex;
  width: 100%;
  padding: 48px 0;
  justify-content: center;
`;

const NoData = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 0;
  justify-content: center;
  color: var(--textPrimary);
`;

export { Wrapper, NoData, Loading };
