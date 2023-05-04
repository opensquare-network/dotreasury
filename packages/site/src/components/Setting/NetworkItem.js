import React from "react";
import styled from "styled-components";

import Text from "../Text";
import ImageWithDark from "../ImageWithDark";

const CapText = styled(Text)`
  text-transform: capitalize;
`;

const Wrapper = styled.div`
  padding: 8px 16px;
  background: #fbfbfb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .grow {
    flex-grow: 1;
  }
  :not(:last-child) {
    margin-bottom: 8px;
  }
  cursor: pointer;
`;

const CheckItem = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid rgba(29, 37, 60, 0.64);
  border-radius: 8px;
  margin-right: 8px;
  flex: 0 0 auto;
`;

const CheckedItem = styled.div`
  width: 16px;
  height: 16px;
  border: 5px solid var(--primary);
  border-radius: 8px;
  margin-right: 8px;
  flex: 0 0 auto;
`;

const Icon = styled(ImageWithDark)`
  position: relative;
  top: -1px;
  margin-right: 8px;
`;

const NetworkItem = ({ icon, name, selectedNetwork, setSelectedNetwork }) => {
  const checked = name === selectedNetwork;
  return (
    <Wrapper onClick={() => setSelectedNetwork(name)}>
      {!checked && <CheckItem />}
      {checked && <CheckedItem />}
      <Icon src={icon} />
      <CapText className="grow">{name}</CapText>
    </Wrapper>
  );
};

export default NetworkItem;
