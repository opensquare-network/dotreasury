import React from "react";
import styled from "styled-components";

import NavItem from "./NavItem";

const Wrapper = styled.header`
  height: 24px;
  display: flex;
  align-items: center;
  gap: 32px;
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
      <NavItem text="Treasury" options={defaultOptions} />
      <NavItem text="Accounts" options={defaultOptions} />
      <NavItem text="Network" options={defaultOptions} />
      <NavItem text="Governance" options={defaultOptions} />
      <NavItem text="Developer" options={defaultOptions} />
      <NavItem text="Setting" />
    </Wrapper>
  );
};

export default Nav;
