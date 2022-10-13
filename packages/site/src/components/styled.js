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
  background: #FFE6E6;
  color: #E90B0B;
`;

export const HintMessage = styled(GenericMessage)`
  background: #FFF2D9;
  color: #F2B12F;
`;
