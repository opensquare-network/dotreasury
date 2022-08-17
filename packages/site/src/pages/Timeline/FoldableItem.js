import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

import { ReactComponent as Circle } from "./circle.svg";
import Bar from "./Bar";
import Item from "./Item";
import { PRIMARY_THEME_COLOR } from "../../constants";
import { getBlockTime } from "../../services/chainApi";
import { useIsMounted } from "../../utils/hooks";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import FoldContext from "./FoldContext";

const Wrapper = styled.div`
  display: flex;
  &:last-child {
    .bar {
      ${(p) =>
        !p.isUnfold &&
        css`
          visibility: hidden;
        `}
    }
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const VerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  & > div:last-child {
    flex-grow: 1;
  }
`;

const HorizontalBar = styled(Bar)`
  height: 2px;
  width: 8px;
  margin: 11px 0;
`;

const VerticalBar = styled(Bar)`
  height: 100%;
  background-color: ${(p) => (p.isUnfold ? "#FFE1E7" : PRIMARY_THEME_COLOR)};
  opacity: ${(p) => (p.isUnfold ? "1" : "0.5")};
`;

const ItemWrapper = styled.div`
  flex-grow: 1;
  & > div:first-child .unfold-btn {
    display: block;
  }

  ${(p) =>
    !p.isUnfold &&
    css`
      & > div:not(:first-child) {
        display: none;
      }
      & > div:first-child .bar {
        visibility: hidden;
      }
    `}
`;

const FoldableItem = ({ data, polkassembly, defaultUnfold, expired, end }) => {
  const [isUnfold, setIsUnfold] = useState(defaultUnfold || false);
  const [expiredTime, setExpiredTime] = useState(0);
  const chain = useSelector(chainSelector);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (expired && end) {
      const getTime = async () => {
        const time = await getBlockTime(chain, end);
        if (isMounted.current) {
          setExpiredTime(time);
        }
      };
      getTime();
    }
  }, [chain, expired, end, isMounted]);

  if (!data || (data.length === 0 && !React.isValidElement(data))) return null;

  return (
    <FoldContext.Provider value={{ isUnfold, setIsUnfold }}>
      <Wrapper isUnfold={isUnfold}>
        <VerticalWrapper>
          <FlexWrapper>
            <Circle />
            <HorizontalBar />
          </FlexWrapper>
          <FlexWrapper>
            <VerticalBar className="bar" isUnfold={isUnfold} />
          </FlexWrapper>
        </VerticalWrapper>
        <ItemWrapper isUnfold={isUnfold}>
          {React.isValidElement(data) ? data : (
            (data || []).map((item, index) => (
              <Item
                key={index}
                data={item}
                polkassembly={index === 0 ? polkassembly : undefined}
              />
            ))
          )}
          {expired && (
            <Item
              data={{
                extrinsicIndexer: { blockTime: expiredTime },
                name: "Expired",
                fields: [{ title: "Expired" }],
              }}
              hideButtonList={true}
            />
          )}
        </ItemWrapper>
      </Wrapper>
    </FoldContext.Provider>
  );
};

export default FoldableItem;
