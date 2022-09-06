import React from "react";
import styled, { css } from "styled-components";

import { ReactComponent as Circle } from "./timeline-loading.svg";
import Label from "./Label";
import Bar from "./Bar";

import ButtonList from "./ButtonList";
import DateShow from "../../components/DateShow";
import TextMinor from "../../components/TextMinor";
import { mrgap } from "../../styles";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import { makeLinkUrl } from "./util";

const Wrapper = styled.div`
  &:last-child .bar {
    visibility: hidden;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  ${css`
    ${mrgap("12px")}
  `}
  & > div:last-child {
    flex-grow: 1;
  }
`;

const VerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  & > div:last-child {
    flex-grow: 1;
  }
`;

const TimeLableWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const CardWrapper = styled.div`
  flex-grow: 1;
  margin: 8px 0 32px;
`;

const TextMinorWrapper = styled(TextMinor)`
  white-space: nowrap;
`;

const LoadingItem = ({
  data,
  polkassembly,
  hideButtonList = false,
}) => {
  const chain = useSelector(chainSelector);
  const link = makeLinkUrl(chain, data);
  return (
    <Wrapper>
      <FlexWrapper>
        <VerticalWrapper>
          <Circle />
          <Bar className="bar" />
        </VerticalWrapper>
        <VerticalWrapper className="flex-grow">
          <FlexWrapper>
            <TimeLableWrapper>
              <TextMinorWrapper>
                <DateShow
                  value={(data.extrinsicIndexer || data.eventIndexer).blockTime}
                />
              </TextMinorWrapper>
              <Label text={data.name} link={link} />
            </TimeLableWrapper>
          </FlexWrapper>
          <CardWrapper>
            {!hideButtonList && (
              <ButtonList
                extrinsicIndexer={data.extrinsicIndexer}
                eventIndexer={data.eventIndexer}
                polkassembly={polkassembly}
                type={data.type}
                chain={chain}
              />
            )}
          </CardWrapper>
        </VerticalWrapper>
      </FlexWrapper>
    </Wrapper>
  );
};

export default LoadingItem;
