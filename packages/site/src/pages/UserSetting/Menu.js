import React from "react";
import styled, { css } from "styled-components";

import TextMinor from "../../components/TextMinor";
import { TEXT_DARK_MAJOR } from "../../constants";
import { ACCOUNT_SETTING, NOTIFICATION, LINKED_ADDRESSES } from "./index";
import GrayImage from "../../components/GrayImage";

const Wrapper = styled.div`
  margin-right: 24px;
  margin-bottom: 16px;
`;

const Item = styled.div`
  display: flex;
  min-width: 200px;
  align-items: center;
  height: 40px;
  cursor: pointer;
  ${(p) =>
    p.selected &&
    css`
      p {
        color: ${TEXT_DARK_MAJOR};
      }
      img {
        -webkit-filter: grayscale(0);
        filter: grayscale(0);
        opacity: 1;
      }
    `}
`;

const ItemText = styled(TextMinor)`
  font-weight: 500;
`;

const ItemImage = styled(GrayImage)`
  margin-right: 8px;
`;

const Menu = ({ tab, setTab }) => {
  return (
    <Wrapper>
      <Item
        selected={tab === ACCOUNT_SETTING || !tab}
        onClick={() => setTab(ACCOUNT_SETTING)}
      >
        <ItemImage src="/imgs/setting.svg" />
        <ItemText>Account settings</ItemText>
      </Item>
      <Item
        selected={tab === NOTIFICATION}
        onClick={() => setTab(NOTIFICATION)}
      >
        <ItemImage src="/imgs/bell.svg" />
        <ItemText>Notification</ItemText>
      </Item>
      <Item
        selected={tab === LINKED_ADDRESSES}
        onClick={() => setTab(LINKED_ADDRESSES)}
      >
        <ItemImage src="/imgs/connected.svg" />
        <ItemText>Link address</ItemText>
      </Item>
    </Wrapper>
  );
};

export default Menu;
