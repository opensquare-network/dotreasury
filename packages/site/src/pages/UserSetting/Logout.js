import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { StyledItem, StyledTitle } from "./components";
import Button from "../../components/Button";
import { WARNING_COLOR } from "../../constants"
import {
  setLoggedInUser
} from "../../store/reducers/userSlice";

const StyledButton = styled(Button)`
  width: 100%;
  color: ${WARNING_COLOR} !important;
  border-color: ${WARNING_COLOR} !important;
  &.ui.button:hover, &.ui.button:active, &.ui.button:focus {
    border-color: ${WARNING_COLOR} !important;
  }
`

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
  )
}

export default DeleteAccount;
