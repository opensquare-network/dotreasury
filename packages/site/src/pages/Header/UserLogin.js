import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import {
  isLoggedInSelector,
  loggedInUserSelector,
} from "../../store/reducers/userSlice";
import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonLabel from "../../components/ButtonLabel";
import TextMinor from "../../components/TextMinor";
import { TEXT_DARK_MAJOR } from "../../constants";

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  & > img {
    margin-right: 8px;
  }
  :hover {
    cursor: pointer;
    p {
      color: ${TEXT_DARK_MAJOR};
      text-decoration: underline;
    }
  }
`;

const SignUpButton = styled(ButtonLabel)`
  margin-right: 32px !important;
`;

const UserLogin = () => {
  const history = useHistory();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const loggedInUser = useSelector(loggedInUserSelector);

  return (
    <>
      {isLoggedIn ? (
        <Wrapper onClick={() => {
          history.push("/settings");
        }}>
          <Image src="/imgs/avatar.png" width="20px" height="20px" />
          <TextMinor>{loggedInUser.username}</TextMinor>
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
