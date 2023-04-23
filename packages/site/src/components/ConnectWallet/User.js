import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRef } from "react";
import { logout } from "../../store/reducers/accountSlice";
import UserIdentity from "../User";
import { useOnClickOutside } from "@osn/common";

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  position: relative;
  height: 32px;
  padding: 6px 16px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  gap: 8px;
`;

const MenuWrapper = styled.div`
  cursor: auto;
  min-width: 200px;
  position: absolute;
  right: 0;
  top: 100%;
  background: #ffffff;
  border: 1px solid #f0f3f8;
  z-index: 1;
  padding: 4px 0;
  margin-top: 4px;

  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);

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
    background-color: #fafafa;
  }
`;

const LogoutWrapper = styled.div`
  display: flex;
  align-items: center;

  :hover {
    color: #1e2134;
  }
`;

export default function User({
  address,
}) {
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
        <LogoutWrapper onClick={onLogout}>
          Disconnect
        </LogoutWrapper>
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
