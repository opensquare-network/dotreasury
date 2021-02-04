import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import {
  isLoggedInSelector,
  loggedInUserSelector,
  userProfileSelector,
  fetchUserProfile
} from "../../store/reducers/userSlice";
import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonLabel from "../../components/ButtonLabel";
import TextMinor from "../../components/TextMinor";
import { TEXT_DARK_MAJOR } from "../../constants";
import { useIndentity } from "../../utils/hooks";
import UserAvatar from "../../components/User/Avatar";
import { getGravatarSrc } from "../../utils";
import { encodeKusamaAddress } from "../../services/chainApi";

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  & > :first-child {
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

const CircleImage = styled(Image)`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`

const UserLogin = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const loggedInUser = useSelector(loggedInUserSelector);
  const userProfile = useSelector(userProfileSelector);
  const address = userProfile?.addresses?.[0];
  const { name: addressName } = useIndentity(address);
  const [addressDisplayName, setAddressDisplayName] = useState("");
  const kusamaAddress = encodeKusamaAddress(address);

  useEffect(() => {
    if (loggedInUser && loggedInUser.username !== userProfile.username) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, loggedInUser, userProfile]);

  useEffect(() => {
    if (address) {
      const kusamaAddress = encodeKusamaAddress(address);
      const addressDisplayName = addressName ?
        addressName :
        `${kusamaAddress.substring(0, 6)}...${kusamaAddress.substring(kusamaAddress.length - 6, kusamaAddress.length)}`;
      setAddressDisplayName(addressDisplayName);
    }
  }, [address, addressName])

  return (
    <>
      {isLoggedIn ? (
        <Wrapper onClick={() => {
          history.push("/settings");
        }}>
          {address && <>
            <UserAvatar address={kusamaAddress} size={20} />
            <TextMinor>{addressDisplayName}</TextMinor>
          </>}
          {!address && <>
            <CircleImage src={getGravatarSrc(loggedInUser.email)} />
            <TextMinor>{loggedInUser.username}</TextMinor>
          </>}
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
