import React, { useContext } from "react";
import styled, { css } from "styled-components";

import { ReactComponent as Circle } from "./circle.svg";
import Label from "./Label";
import Bar from "./Bar";

import CardItem from "./CardItem";
import ButtonList from "./ButtonList";
import DateShow from "../../components/DateShow";
import TextMinor from "../../components/TextMinor";
import { mrgap } from "../../styles";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import FoldContext from "./FoldContext";
import { makeLinkUrl } from "./util";
import {
  bg_transparent,
  border,
  border_color,
  h,
  inline_flex,
  items_center,
  rounded_4,
  w,
  cursor_pointer,
  hidden,
} from "../../styles/tailwindcss";
import IconMask from "../../components/Icon/Mask";

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

const UnfoldButton = styled.button`
  ${hidden};
  ${w(20)};
  ${h(20)};
  ${bg_transparent};
  ${border};
  ${border_color("neutral400")};
  ${rounded_4};
  padding: 0;
  ${cursor_pointer};

  i {
    ${inline_flex};
    ${items_center};
  }
  ${(p) =>
    p.isUnfold &&
    css`
      i {
        transform: rotate(180deg);
      }
    `}
`;

const TextMinorWrapper = styled(TextMinor)`
  white-space: nowrap;
`;

const Item = ({ data, polkassembly, hideButtonList = false }) => {
  const { isUnfold, setIsUnfold } = useContext(FoldContext);

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
            <UnfoldButton
              className="unfold-btn"
              onClick={() => setIsUnfold(!isUnfold)}
              isUnfold={isUnfold}
            >
              <IconMask
                src="/imgs/icon-triangle-down.svg"
                color="textPrimary"
                size="100%"
              />
            </UnfoldButton>
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
                type={data.type}
              />
            )}
          </CardWrapper>
        </VerticalWrapper>
      </FlexWrapper>
    </Wrapper>
  );
};

export default Item;
