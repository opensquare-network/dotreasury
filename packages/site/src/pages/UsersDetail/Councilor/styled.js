import styled from "styled-components";
import CardOrigin from "../../../components/Card";
import { TEXT_DARK_MAJOR } from "../../../constants";
import { h4_16_semibold } from "../../../styles/text";

export const Card = styled(CardOrigin)`
  padding: 24px;
  margin-bottom: 24px;
`;

export const CardTitle = styled.h4`
  color: ${TEXT_DARK_MAJOR};
  margin-bottom: 24px;
  ${h4_16_semibold};
`;
