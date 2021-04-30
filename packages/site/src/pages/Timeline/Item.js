import React from "react";
import styled, { css } from "styled-components";

import Circle from "./Circle";
import Label from "./Label";
import Bar from "./Bar";

import CardItem from "./CardItem";
import ButtonList from "./ButtonList";
import DateShow from "../../components/DateShow";
import TextMinor from "../../components/TextMinor";
import { mrgap } from "../../styles";

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

const UnfoldButton = styled.img`
  cursor: pointer;
  display: none;
  ${(p) =>
    p.isUnfold &&
    css`
      transform: rotate(0.5turn);
    `}
`;

const TextMinorWrapper = styled(TextMinor)`
  white-space: nowrap;
`;

const Item = ({
  data,
  polkassembly,
  onUnfoldBtnClick,
  isUnfold,
  hideButtonList = false,
}) => {
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
              <Label text={data.name} />
            </TimeLableWrapper>
            <UnfoldButton
              src="/imgs/btn-unfold.svg"
              className="unfold-btn"
              onClick={onUnfoldBtnClick}
              isUnfold={isUnfold}
            />
          </FlexWrapper>
          <CardWrapper>
            {data.fields.map(({ title, value }, index) => (
              <CardItem key={index} title={title}>
                {value}
              </CardItem>
            ))}
            {!hideButtonList && (
              <ButtonList
                extrinsicIndexer={data.extrinsicIndexer}
                eventIndexer={data.eventIndexer}
                polkassembly={polkassembly}
              />
            )}
          </CardWrapper>
        </VerticalWrapper>
      </FlexWrapper>
    </Wrapper>
  );
};

export default Item;
