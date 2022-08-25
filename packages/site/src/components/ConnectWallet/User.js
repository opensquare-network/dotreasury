import styled from "styled-components";
import UserAvatar from "../User/Avatar";
import Address from "../Address";

const Wrapper = styled.div`
  display: flex;
  height: 32px;
  padding: 6px 16px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  gap: 8px;
`;

const Addr = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.9);
`;

export default function User({ address }) {
  return (
    <Wrapper>
      <UserAvatar address={address} size={20} />
      <Addr>
        <Address>{address}</Address>
      </Addr>
    </Wrapper>
  );
}
