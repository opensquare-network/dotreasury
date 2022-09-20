import styled from "styled-components";
import Card from "../../../components/Card";
import { TEXT_DARK_MAJOR } from "../../../constants";
import { h4_16_semibold } from "../../../styles/text";

export const CouncilorShipCardWrapper = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
`;

export const CouncilorShipCardDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CouncilorShipCardTitle = styled.h4`
  color: ${TEXT_DARK_MAJOR};
  margin-bottom: 24px;
  ${h4_16_semibold};
`;
