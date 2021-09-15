import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import {
  fetchUserProfile,
  isLoggedInSelector,
  loggedInUserSelector,
  setLoggedInUser,
  userProfileSelector,
} from "../../store/reducers/userSlice";
import ButtonLabel from "../../components/ButtonLabel";
import TextMinor from "../../components/TextMinor";
import { TEXT_DARK_MAJOR } from "../../constants";
import { useIdentity } from "../../utils/hooks";
import UserAvatar from "../../components/User/Avatar";
import { getGravatarSrc } from "../../utils";
import scanApi from "../../services/scanApi";
import { chainSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 8px;
  }
  p {
    color: ${(p) =>
      p.symbol === "ksm" ? "rgba(255,255,255,0.8)" : "rgba(29,37,60,0.64)"};
    @media screen and (max-width: 850px) {
      color: rgba(29, 37, 60, 0.64);
    }
  }
  :hover {
    cursor: pointer;
    p {
      color: ${(p) => (p.symbol === "ksm" ? "#fff" : TEXT_DARK_MAJOR)};
      @media screen and (max-width: 850px) {
        color: ${TEXT_DARK_MAJOR};
      }
      text-decoration: underline;
    }
  }
`;

const SignUpButton = styled(ButtonLabel)`
  margin-right: 32px !important;
  font-weight: 500 !important;
  button {
    font-weight: 600 !important;
  }
`;

const CircleImage = styled(Image)`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

const UserLogin = ({ symbol }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const loggedInUser = useSelector(loggedInUserSelector);
  const userProfile = useSelector(userProfileSelector);
  const chain = useSelector(chainSelector);
  const address = userProfile?.addresses?.filter((i) => i.chain === chain)[0];
  const { name: addressName } = useIdentity(address && address.address);
  const [addressDisplayName, setAddressDisplayName] = useState("");

  useEffect(() => {
    if (loggedInUser && loggedInUser.username !== userProfile?.username) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, loggedInUser, userProfile]);

  useEffect(() => {
    if (address) {
      const addressDisplayName = addressName
        ? addressName
        : `${address.address.substring(0, 6)}...${address.address.substring(
            address.address.length - 6,
            address.address.length
          )}`;
      setAddressDisplayName(addressDisplayName);
    }
  }, [address, addressName]);

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
        <Wrapper
          symbol={symbol}
          onClick={() => {
            history.push("/settings");
          }}
        >
          {address && (
            <>
              <UserAvatar address={address.address} size={20} />
              <TextMinor>{addressDisplayName}</TextMinor>
            </>
          )}
          {!address && (
            <>
              <CircleImage src={getGravatarSrc(loggedInUser.email)} />
              <TextMinor>{loggedInUser.username}</TextMinor>
            </>
          )}
        </Wrapper>
      ) : (
        <>
          <NavLink to="/register" className="button signUp">
            <SignUpButton>Sign up</SignUpButton>
          </NavLink>
        </>
      )}
    </>
  );
};

export default UserLogin;
