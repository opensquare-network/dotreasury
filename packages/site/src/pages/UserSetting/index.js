import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { loggedInUserSelector } from "../../store/reducers/userSlice";
import Card from "../../components/Card";
import Username from "./Username";
import Email from "./Email";
import Password from "./Password";
import Notification from "./Notifications";
import DeleteAccount from "./DeleteAccount";
import Menu from "./Menu";
import LinkedAddresses from "./LinkedAddresses";
import Logout from "./Logout";
import {
  fetchUserProfile,
  userProfileSelector,
} from "../../store/reducers/userSlice";

const Wrapper = styled.div`
  display: flex;
  margin: 28px;
  justify-content: center;
  align-items: flex-start;
  @media screen and (max-width: 970px) {
    flex-direction: column;
    align-items: flex-start;
    margin: 0 auto;
    width: fit-content;
  }
  @media screen and (max-width: 680px) {
    width: 100%;
  }
`;

const CardWrapper = styled(Card)`
  width: 648px;
  padding: 48px 64px;
  @media screen and (max-width: 680px) {
    width: 100%;
    padding: 20px;
  }
`;

export const ACCOUNT_SETTING = "account_setting";
export const NOTIFICATION = "notification";
export const LINKED_ADDRESSES = "linked_addresses";

const UserSetting = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(ACCOUNT_SETTING);
  const loggedInUser = useSelector(loggedInUserSelector);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, loggedInUser]);

  const userProfile = useSelector(userProfileSelector);

  if (!loggedInUser) {
    return <Redirect to="/" />;
  }

  const { username, email, emailVerified } = userProfile;

  return (
    <Wrapper>
      <Menu tab={tab} setTab={setTab} />
      <CardWrapper>
        {tab === ACCOUNT_SETTING && (
          <div>
            <Username username={username} />
            <Email email={email} emailVerified={emailVerified} />
            <Password />
            <Logout />
            <DeleteAccount />
          </div>
        )}
        {tab === NOTIFICATION && (
          <div>
            <Notification />
          </div>
        )}
        {tab === LINKED_ADDRESSES && (
          <div>
            <LinkedAddresses />
          </div>
        )}
      </CardWrapper>
    </Wrapper>
  );
};

export default UserSetting;
