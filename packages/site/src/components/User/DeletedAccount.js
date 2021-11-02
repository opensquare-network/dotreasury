import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const Avatar = styled.img`
  margin-right: 8px;
  width: 22px;
  height: 22px;
`;

const Deleted = styled.div`
  font-family: SF Mono;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.3);
`;

const DeletedAccount = () => {
  return (
    <Wrapper>
      <Avatar src="/imgs/avatar-deleted.svg" alt="" />
      <Deleted>[Deleted]</Deleted>
    </Wrapper>
  );
};

export default DeletedAccount;
