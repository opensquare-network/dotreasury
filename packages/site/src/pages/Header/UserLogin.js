import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import {
  isLoggedInSelector,
  setLoggedInUser,
  loggedInUserSelector,
} from "../../store/reducers/userSlice";
import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonLabel from "../../components/ButtonLabel";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  & > img {
    margin-right: 8px;
  }
`;

const SignUpButton = styled(ButtonLabel)`
  margin-right: 32px !important;
`;

const UserLogin = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const loggedInUser = useSelector(loggedInUserSelector);

  return (
    <>
      {isLoggedIn ? (
        <Wrapper>
          <Image src="/imgs/avatar.png" width="20px" height="20px" />
          <Dropdown text={loggedInUser.username}>
            <Dropdown.Menu direction="left">
              <Dropdown.Item
                icon="setting"
                text="Settings"
                onClick={() => {
                  history.push("/settings");
                }}
              />
              <Dropdown.Item
                icon="log out"
                text="Logout"
                onClick={() => {
                  dispatch(setLoggedInUser(null));
                  localStorage.removeItem("token");
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Wrapper>
      ) : (
        <>
          <NavLink to="/register">
            <SignUpButton>Sign up</SignUpButton>
          </NavLink>
          <NavLink to="/login">
            <ButtonPrimary>Login</ButtonPrimary>
          </NavLink>
        </>
      )}
    </>
  );
};

export default UserLogin;
