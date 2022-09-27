import styled from "styled-components";
import { p_12_normal, p_14_medium } from "../../../../styles/text";
import Loading from "../../../../components/TableLoading";

export const TooltipContentCount = styled.p`
  margin-bottom: 0;
  ${p_14_medium};
`;
export const TooltipContentDate = styled.p`
  ${p_12_normal};
`;

export const CouncilorShipLoading = styled(Loading)`
  .ui.segment {
    width: auto;
  }
`;
