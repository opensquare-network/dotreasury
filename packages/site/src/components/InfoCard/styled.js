import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { h3_18_semibold, p_14_normal, p_12_normal } from "../../styles/text";
import {
  Greyscale_Grey_200,
  TEXT_DARK_MAJOR,
  TEXT_DARK_MINOR,
} from "../../constants";
import Card from "../../components/Card";

export const InfoCardWrapper = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
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
  }
`;

export const InfoCardIcon = styled(Image)`
  margin-right: 24px;
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;

  @media screen and (max-width: 900px) {
    margin-right: 0;
    margin-bottom: 12px;
  }
`;

export const InfoCardDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const InfoCardTitle = styled.h3`
  color: ${TEXT_DARK_MAJOR};
  margin-bottom: 8px;
  ${h3_18_semibold};
`;

export const InfoCardDescription = styled.p`
  color: ${TEXT_DARK_MINOR};
  ${p_14_normal};
`;

export const InfoCardLinksWrapper = styled.div`
  margin-top: 16px;
`;

export const InfoCardDivider = styled.div`
  width: 1px;
  height: inherit;
  background-color: ${Greyscale_Grey_200};
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
  color: ${TEXT_DARK_MINOR};
  ${p_12_normal};
`;
