import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const GenericMessage = styled.div`
  display: flex;
  padding: 8px 16px;

  border-radius: 4px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

export const ErrorMessage = styled(GenericMessage)`
  background: var(--red100);
  color: var(--red500);
`;

export const HintMessage = styled(GenericMessage)`
  background: var(--yellow100);
  color: var(--yellow500);
`;
