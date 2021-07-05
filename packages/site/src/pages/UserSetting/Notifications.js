import React from "react";
import styled from "styled-components";

import { StyledItem, StyledTitle } from "./components";
import TextMinor from "../../components/TextMinor";
import Toggle from "../../components/Toggle";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/scanApi";
import {
  userProfileSelector,
  fetchUserProfile,
} from "../../store/reducers/userSlice";
import { addToast } from "../../store/reducers/toastSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Notifications = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(userProfileSelector);

  const toggleMentionNotification = async () => {
    const { result, error } = await api.authFetch(
      `/user/notification`,
      {},
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentioned: !userProfile?.notification?.mentioned,
        }),
      }
    );

    if (result) {
      dispatch(fetchUserProfile());
      dispatch(
        addToast({
          type: "success",
          message: "Change notification successfully!",
        })
      );
    }

    if (error) {
      dispatch(
        addToast({
          type: "error",
          message: "Change notification error",
        })
      );
    }
  };

  return (
    <StyledItem>
      <StyledTitle>Email notifications</StyledTitle>
      <Wrapper>
        <TextMinor>Subscribe to reply your comment.</TextMinor>
        <Toggle
          checked={userProfile?.notification?.mentioned}
          onClick={toggleMentionNotification}
        />
      </Wrapper>
    </StyledItem>
  );
};

export default Notifications;
