import styled, { css } from "styled-components";
import { h3_18_semibold, p_14_normal, p_12_normal } from "../../styles/text";

import Card from "../../components/Card";
import ImageWithDark from "../ImageWithDark";

export const InfoCardWrapper = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
  display: flex;

  ${(p) =>
    p.minHeight &&
    css`
      min-height: ${p.minHeight}px;
    `}

  @media screen and (max-width: 481px) {
    & * {
      text-align: left !important;
    }
  }

  @media screen and (max-width: 900px) {
    display: block;
    padding: 0;
  }
`;

export const InfoCardDetailWrapper = styled.div`
  display: flex;
  margin-right: 48px;
  flex-basis: 775px;

  @media screen and (max-width: 900px) {
    padding: 24px;
    display: block;
    margin-right: 0;
  }
`;

export const InfoCardIconWrapper = styled.div`
  margin-right: 24px;
  min-width: 64px;
  min-height: 64px;
  max-width: 64px;
  max-height: 64px;

  @media screen and (max-width: 900px) {
    margin-right: 0;
    margin-bottom: 12px;
  }
`;

export const InfoCardIcon = styled(ImageWithDark)`
  min-width: inherit;
  min-height: inherit;
  max-width: inherit;
  max-height: inherit;
`;

export const InfoCardDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const InfoCardTitle = styled.h3`
  color: var(--textPrimary);
  margin-bottom: 8px;
  ${h3_18_semibold};
`;

export const InfoCardDescription = styled.p`
  color: var(--textSecondary);
  ${p_14_normal};
`;

export const InfoCardLinksWrapper = styled.div`
  margin-top: 16px;
`;

export const InfoCardDivider = styled.div`
  width: 1px;
  height: inherit;
  background-color: var(--neutral300);
  margin: 0 24px;

  @media screen and (max-width: 900px) {
    width: 100%;
    height: 1px;
    margin: 0;
  }
`;

export const InfoCardExtraWrapper = styled.div`
  @media screen and (max-width: 900px) {
    padding: 24px;
  }
`;

export const InfoCardExtraItemWrapper = styled.div`
  & + & {
    margin-top: 16px;
  }
`;
export const InfoCardExtraItemLabel = styled.p`
  margin-bottom: 4px;
  color: var(--textSecondary);
  ${p_12_normal};
`;
