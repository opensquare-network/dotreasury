import React, { useState } from "react";
import { Popup as PopupOrigin } from "semantic-ui-react";
import styled from "styled-components";
import { rounded_4, shadow_200 } from "../../styles/tailwindcss";
import { p_12_normal } from "../../styles/text";
import { ReactComponent as DirectionSVG } from "../Icon/direction.svg";

const Popup = styled(PopupOrigin)`
  width: 220px;
  padding: 0 !important;
  border-color: var(--neutral300) !important;
  ${rounded_4} !important;
  margin-top: 0 !important;
  ${shadow_200} !important;
  background-color: var(--neutral100) !important;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px 0;
`;

const Title = styled.span`
  ${p_12_normal}
  color: var(--textTertiary);
  padding: 4px 0 4px 28px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  ${p_12_normal}
  color: var(--textPrimary);
  :hover {
    background-color: var(--neutral200);
  }
`;

const DirectionWrapper = styled.div`
  display: inline-flex;
  margin: 4px 4px 4px 8px;
  svg {
    transform: ${(props) => (props.direction === "asc" ? "rotate(180deg)" : "")};
    path {
      fill: var(--textTertiary);
    }
  }
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

export default function SortByValuePopup({ trigger, sortField, setSortField, sortDirection, setSortDirection }) {
  const [isOpen, setIsOpen] = useState(false);

  const popupContent = (
    <Wrapper>
      <Title>Ranked by</Title>
      <MenuItem onClick={() => {
        setSortField("tokenValue");
        setSortDirection(sortField === "tokenValue" && sortDirection === "desc" ? "asc" : "desc");
        setIsOpen(false);
      }}>
        <DirectionWrapper direction={sortDirection} visible={sortField === "tokenValue"}>
          <DirectionSVG />
        </DirectionWrapper>
        <span>Token amount</span>
      </MenuItem>
      <MenuItem onClick={() => {
        setSortField("fiatValue");
        setSortDirection(sortField === "fiatValue" && sortDirection === "desc" ? "asc" : "desc");
        setIsOpen(false);
      }}>
        <DirectionWrapper direction={sortDirection} visible={sortField === "fiatValue"}>
          <DirectionSVG />
        </DirectionWrapper>
        <span>Fiat value</span>
      </MenuItem>
    </Wrapper>
  );

  return (
    <Popup
      basic={true}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      content={popupContent}
      on="click"
      trigger={trigger}
      hideOnScroll
    />
  );
}
