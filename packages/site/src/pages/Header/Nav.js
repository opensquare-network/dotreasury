import React from "react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";

import NavItem from "./NavItem";

const Wrapper = styled.header`
  height: 24px;
`;

const NavWrapper = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  gap: 32px;
  @media screen and (max-width: 1140px) {
    display: none;
  }
`;

const NavButtonWrapper = styled.div`
  button {
    background: transparent !important;
  }
  @media screen and (min-width: 1128px) {
    display: none;
  }
`;

const Nav = () => {
  const defaultOptions = [
    {
      text: "New",
    },
    {
      text: "Open...",
      description: "ctrl + o",
    },
    {
      icon: "folder",
      text: "Move to folder",
    },
  ];

  return (
    <Wrapper>
      <NavWrapper>
        <NavItem text="Treasury" options={defaultOptions} />
        <NavItem text="Accounts" options={defaultOptions} />
        <NavItem text="Network" options={defaultOptions} />
        <NavItem text="Governance" options={defaultOptions} />
        <NavItem text="Developer" options={defaultOptions} />
        <NavItem text="Setting" />
      </NavWrapper>
      <NavButtonWrapper>
        <Button icon="sidebar" />
      </NavButtonWrapper>
    </Wrapper>
  );
};

export default Nav;
