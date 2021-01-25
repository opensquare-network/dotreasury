import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
  isLoggedInSelector,
  setLoggedInUser,
  loggedInUserSelector
} from "../../store/reducers/userSlice";
import { PRIMARY_THEME_COLOR } from "../../constants";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  & > img {
    margin-right: 8px;
  }
`

const ColoredLink = styled(Link)`
  color: ${PRIMARY_THEME_COLOR};
  :hover {
    color: ${PRIMARY_THEME_COLOR};
  }
`

const UserLogin = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const loggedInUser = useSelector(loggedInUserSelector);

  return (
    <>
      {
        isLoggedIn
        ? (
          <Wrapper>
            <Image src="/imgs/avatar.png" width="20px" height="20px" />
            <Dropdown
              text={loggedInUser.username}
            >

              <Dropdown.Menu direction="left">
                <Dropdown.Item icon="setting" text="Settings" />
                <Dropdown.Item icon="log out" text="Logout" onClick={() => {
                  dispatch(setLoggedInUser(null));
                  localStorage.removeItem("token");
                }} />
              </Dropdown.Menu>
            </Dropdown>
          </Wrapper>
        )
        : (
          <ColoredLink to="/login">
            Login
          </ColoredLink>
        )
      }
    </>
  )
};

export default UserLogin;
