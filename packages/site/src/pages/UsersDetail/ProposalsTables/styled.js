import styled, { css } from "styled-components";
import { h4_16_semibold } from "../../../styles/text";
import Card from "../../../components/Card";
import { TEXT_DARK_MAJOR, TEXT_DARK_ACCESSORY } from "../../../constants";

export const CardWrapper = styled(Card)`
  overflow-x: hidden;
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

export const Wrapper = styled.div`
  overflow: hidden;
`;

export const TableWrapper = styled.div`
  overflow: scroll;
`;

export const TableHeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableTitleLabel = styled.span`
  text-transform: capitalize;
  margin-right: 8px;
`;
export const TableTitle = styled.h4`
  display: inline-block;
  margin: 0;
  ${h4_16_semibold};

  & + & {
    margin-left: 32px;
  }

  &:hover {
    cursor: pointer;
  }

  a {
    display: block;
    color: ${TEXT_DARK_ACCESSORY};

    &:hover {
      color: ${TEXT_DARK_MAJOR};
    }
  }

  ${(p) =>
    p.active &&
    css`
      a {
        color: ${TEXT_DARK_MAJOR};
      }
    `}
`;
export const TableTitleWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
`;
