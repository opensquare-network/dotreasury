import styled, { css } from "styled-components";
import CardOrigin from "../../../components/Card";
import {
  TEXT_LIGHT_MAJOR,
  TEXT_LIGHT_MINOR,
  TEXT_DARK_MAJOR,
  TEXT_DARK_ACCESSORY,
} from "../../../constants";
import { h4_16_semibold, p_12_normal } from "../../../styles/text";

export const Card = styled(CardOrigin)`
  padding: 24px;
  margin-bottom: 24px;
`;

export const CardTitle = styled.h4`
  color: var(--textPrimary);
  margin-bottom: 24px;
  ${h4_16_semibold};
`;
export const CardTitleDescription = styled.small`
  margin-left: 8px;
  color: var(--textTertiary);
  ${p_12_normal}

  @media screen and (max-width: 900px) {
    display: block;
    margin-left: 0;
  }
`;

export const TooltipContentDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const TooltipContentDetail = styled.div`
  ${(p) =>
    css`
      ${TooltipContentDetailItem} {
        gap: ${p.gap || 20}px;
      }
    `}
`;

export const TooltipContentDetailItemLabel = styled.div`
  color: ${TEXT_LIGHT_MINOR};
  ${p_12_normal};
`;
export const TooltipContentDetailItemValue = styled.div`
  color: ${TEXT_LIGHT_MAJOR};
  ${p_12_normal};

  a {
    color: inherit;
    text-decoration: underline;
    ${p_12_normal};

    &:hover {
      color: inherit;
    }
  }
`;
