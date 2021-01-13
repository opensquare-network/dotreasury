import React, { Fragment } from 'react'
import styled from "styled-components";
import { normalizeTimeDuration } from "../utils";

const DefaultValueWrapper = Fragment;

const DefaultUnitWrapper = Fragment;

const DefaultSectionWrapper = styled.span`
`
const DefaultTimeWrapper = styled.div`
display: flex;
gap: 4px;
`
const defaultUnitMapper = { y: "y", mon: "mon", d: "d", h: "h", min: "min", s: "s" };

export default function TimePeriod({
  time,
  maxSection = 2,
  ValueWrapper = DefaultValueWrapper,
  UnitWrapper = DefaultUnitWrapper,
  SectionWrapper = DefaultSectionWrapper,
  TimeWrapper = DefaultTimeWrapper,
  unitMapper = {}
}) {
  unitMapper = Object.assign({}, defaultUnitMapper, unitMapper)
  const nornalizedTime = normalizeTimeDuration(time, maxSection);
  return <TimeWrapper>
    { nornalizedTime.map(sec =>
        <SectionWrapper key={sec[1]}>
          <ValueWrapper>{sec[0]}</ValueWrapper>
          <UnitWrapper>{unitMapper[sec[1]]}</UnitWrapper>
        </SectionWrapper>
      ) }
    </TimeWrapper>
}
