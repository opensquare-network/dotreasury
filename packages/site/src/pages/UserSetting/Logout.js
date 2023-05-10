import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { StyledItem, StyledTitle } from "./components";
import Button from "../../components/Button";
import {
  setLoggedInUser,
} from "../../store/reducers/userSlice";

const StyledButton = styled(Button)`
  width: 100%;
  color: var(--red500) !important;
  border-color: var(--red500) !important;
  &.ui.button:hover,
  &.ui.button:active,
  &.ui.button:focus {
    border-color: var(--red500) !important;
  }
`;

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <StyledItem>
      <StyledTitle>
        Logout
      </StyledTitle>
      <StyledButton onClick={() => {
        dispatch(setLoggedInUser(null));
        localStorage.removeItem("token");
        history.push("/");
      }}>Logout my account</StyledButton>
    </StyledItem>
  );
};

export default DeleteAccount;
