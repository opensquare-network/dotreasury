import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRef } from "react";
import { logout } from "../../store/reducers/accountSlice";
import UserIdentity from "../User";
import { useOnClickOutside } from "@osn/common";
import { rounded_4, shadow_200 } from "../../styles/tailwindcss";

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  position: relative;
  height: 32px;
  padding: 6px 16px;
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  gap: 8px;
`;

const MenuWrapper = styled.div`
  cursor: auto;
  min-width: 200px;
  position: absolute;
  right: 0;
  top: 100%;
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  z-index: 1;
  padding: 4px 0;
  margin-top: 4px;
  ${rounded_4};
  ${shadow_200};

  @media screen and (max-width: 768px) {
    margin-top: 19px;
    border: none;
    box-shadow: none;
    width: 100%;
    position: initial;
    padding: 0;
    border-bottom: 20px solid white;
  }

  .connect {
    margin: auto;
  }
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
  :hover {
    background-color: var(--neutral200);
  }
`;

const LogoutWrapper = styled.div`
  display: flex;
  align-items: center;

  :hover {
    color: var(--textPrimary);
  }
`;

export default function User({ address }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const ref = useRef();
  useOnClickOutside(ref, (event) => {
    setShowMenu(false);
  });

  const onLogout = () => {
    dispatch(logout());
    setShowMenu(false);
  };

  const Menu = (
    <MenuWrapper ref={ref} onClick={(e) => e.stopPropagation()}>
      <MenuItem>
        <LogoutWrapper onClick={onLogout}>Disconnect</LogoutWrapper>
      </MenuItem>
    </MenuWrapper>
  );

  return (
    <>
      <Wrapper onClick={() => setShowMenu(true)}>
        <UserIdentity
          address={address}
          avatarSize={20}
          popup={false}
          noLink={true}
        />
        {showMenu && Menu}
      </Wrapper>
    </>
  );
}
