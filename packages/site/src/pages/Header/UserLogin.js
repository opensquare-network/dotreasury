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
import scanApi from "../../services/scanApi";
import { setLoggedInUser } from "../../store/reducers/userSlice";

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
  const address = userProfile?.addresses?.filter(i => i.chain === "kusama")[0];
  const { name: addressName } = useIndentity(address?.wildcardAddress);
  const [addressDisplayName, setAddressDisplayName] = useState("");

  useEffect(() => {
    if (loggedInUser && loggedInUser.username !== userProfile.username) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, loggedInUser, userProfile]);

  useEffect(() => {
    if (address) {
      const addressDisplayName = addressName ?
        addressName :
        `${address.address.substring(0, 6)}...${address.address.substring(address.address.length - 6, address.address.length)}`;
      setAddressDisplayName(addressDisplayName);
    }
  }, [address, addressName])

  useEffect(() => {
    const sub = scanApi.jwtExpire.subscribe(() => {
      dispatch(setLoggedInUser(null));
      localStorage.removeItem("token");
    });
    return () => {
      sub.unsubscribe();
    };
  }, [dispatch]);

  return (
    <>
      {isLoggedIn ? (
        <Wrapper onClick={() => {
          history.push("/settings");
        }}>
          {address && <>
            <UserAvatar address={address.address} size={20} />
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
