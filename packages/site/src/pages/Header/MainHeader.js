import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import ScanHeight from "./ScanHeight";
import {
  isLoggedInSelector,
  setLoggedInUser,
} from "../../store/reducers/userSlice";

const Wrapper = styled.header`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
display: flex;
align-items: center;
`

const Right = styled.div`
`

const ScanHeightWrapper = styled.div`
margin-left: 24px;
`

const HeaderExamplePage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);

  return (
    <Wrapper>
      <Left>
        <NavLink to="/">
          <Logo />
        </NavLink>
        <ScanHeightWrapper>
          <ScanHeight />
        </ScanHeightWrapper>
      </Left>
      <Right>
        {
          isLoggedIn
          ? (
            <Link to="?#" onClick={(e) => {
              e.preventDefault();
              dispatch(setLoggedInUser(null));
            }}>
              Logout
            </Link>
          )
          : (
            <NavLink to="/login">
              Login
            </NavLink>
          )
        }
      </Right>
    </Wrapper>
  )
};

export default HeaderExamplePage;
