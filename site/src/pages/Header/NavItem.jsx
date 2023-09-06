import React from "react";
import styled from "styled-components";
import { Dropdown } from "semantic-ui-react";

const NavLink = styled.header`
  color: #1d253c;
  cursor: pointer;
`;

const NaveDropdown = styled(Dropdown)`
  color: #1d253c;

  .dropdown.icon {
    color: rgba(29, 37, 60, 0.24);
  }
`;

const NavItem = ({ text, options }) => {
  if (options && options.length > 0) {
    return (
      <NaveDropdown text={text}>
        <Dropdown.Menu>
          {options.map((item) => (
            <Dropdown.Item
              key={item.text}
              icon={item.icon}
              text={item.text}
              description={item.description}
            />
          ))}
        </Dropdown.Menu>
      </NaveDropdown>
    );
  } else {
    return <NavLink>{text}</NavLink>;
  }
};

export default NavItem;
