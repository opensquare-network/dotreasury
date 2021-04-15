import React from "react";
import styled, { css } from "styled-components";

import { PRIMARY_THEME_COLOR } from "../../constants";
import Text from "../Text";

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
  border: 5px solid ${PRIMARY_THEME_COLOR};
  border-radius: 8px;
  margin-right: 8px;
  flex: 0 0 auto;
`;

const Detail = styled(Text)`
  font-weight: 500;
  color: #3abc3f;
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 100 &&
    css`
      color: #ee7735;
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 300 &&
    css`
      color: #ec4730;
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "string" &&
    css`
      color: #ec4730;
    `}
`;

const SettingItem = ({
  node: { name, url, delay },
  selectedNode,
  setSelectedNode,
}) => {
  const checked = url === selectedNode;
  return (
    <Wrapper onClick={() => setSelectedNode(url)}>
      {!checked && <CheckItem />}
      {checked && <CheckedItem />}
      <Text className="grow">Hosted by {name}</Text>
      {delay && (
        <Detail delay={delay}>
          {typeof delay === "number" ? `${delay} ms` : delay}
        </Detail>
      )}
    </Wrapper>
  );
};

export default SettingItem;
