import React from 'react'
import styled from "styled-components";
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration';

const DefaultValueWrapper = styled.span`
`

const DefaultUnitWrapper = styled.span`
`

const DefaultSectionWrapper = styled.span`
`

const DefaultTimeWrapper = styled.div`
display: flex;
gap: 4px;
`

const defaultUnitMapper = { y: "y", mon: "mon", d: "d", h: "h", min: "min", s: "s" };

dayjs.extend(duration);

export default function TimePeriod({
  time,
  maxSection = 2,
  ValueWrapper = DefaultValueWrapper,
  UnitWrapper = DefaultUnitWrapper,
  SectionWrapper = DefaultSectionWrapper,
  TimeWrapper = DefaultTimeWrapper,
  unitMapper = {}
}) {
  const d = dayjs.duration(time)
  unitMapper = Object.assign({}, defaultUnitMapper, unitMapper)

  const sections = [
    d.years() &&
      <SectionWrapper>
        <ValueWrapper>{d.years()}</ValueWrapper>
        <UnitWrapper>{unitMapper.y}</UnitWrapper>
      </SectionWrapper>,
    d.months() &&
      <SectionWrapper>
        <ValueWrapper>{d.months()}</ValueWrapper>
        <UnitWrapper>{unitMapper.mon}</UnitWrapper>
      </SectionWrapper>,
    d.days() &&
      <SectionWrapper>
        <ValueWrapper>{d.days()}</ValueWrapper>
        <UnitWrapper>{unitMapper.d}</UnitWrapper>
      </SectionWrapper>,
    d.hours() &&
      <SectionWrapper>
        <ValueWrapper>{d.hours()}</ValueWrapper>
        <UnitWrapper>{unitMapper.h}</UnitWrapper>
      </SectionWrapper>,
    d.minutes() &&
      <SectionWrapper>
        <ValueWrapper>{d.minutes()}</ValueWrapper>
        <UnitWrapper>{unitMapper.min}</UnitWrapper>
      </SectionWrapper>,
  ];

  let result = [];

  for (let i = 0, j = 0; i < sections.length && j < maxSection; i++) {
    const sec = sections[i];
    if (!sec && !j) {
      continue;
    }

    if (sec) {
      result.push(sec);
    }

    j++;
  }

  if (result.length === 0) {
    result.push(
      <SectionWrapper>
        <ValueWrapper>{d.seconds()}</ValueWrapper>
        <UnitWrapper>{unitMapper.s}</UnitWrapper>
      </SectionWrapper>
    );
  }

  return <TimeWrapper>{result}</TimeWrapper>;
}
