import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import {
  loggedInUserSelector,
} from "../../store/reducers/userSlice";
import Card from "../../components/Card";
import Username from "./Username";
import Email from "./Email";
import Password from "./Password";
import Notification from "./Notifications";
import DeleteAccount from "./DeleteAccount";
import Menu from "./Menu";
import LinkedAddresses from "./LinkedAddresses";
import Logout from "./Logout";

const Wrapper = styled.div`
  display: flex;
  margin: 28px;
  justify-content: center;
  align-items: flex-start;
`

const CardWrapper = styled(Card)`
  width: 648px;
  padding: 48px 64px;
`

export const ACCOUNT_SETTING = "account_setting";
export const NOTIFICATION = "notification";
export const LINKED_ADDRESSES = "linked_addresses";


const UserSetting = () => {
  const [tab, setTab] = useState(ACCOUNT_SETTING);
  const loggedInUser = useSelector(loggedInUserSelector);
  
  const username = loggedInUser?.username;
  const email = loggedInUser?.email;
  
  return (
    <Wrapper>
      <Menu tab={tab} setTab={setTab}/>
      <CardWrapper>
        {tab === ACCOUNT_SETTING && <div>
          <Username username={username} />
          <Email email={email} />
          <Password />
          <Logout />
          <DeleteAccount />
        </div>}
        {tab === NOTIFICATION && <div>
          <Notification />
        </div>}
        {tab === LINKED_ADDRESSES && <div>
          <LinkedAddresses />
        </div>}
      </CardWrapper>
    </Wrapper>
  );
};

export default UserSetting;
