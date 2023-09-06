import React, { useCallback, useEffect, useState } from "react";
import ReactSlider from "react-slider";
import styled, { css } from "styled-components";
import { ReactComponent as ThumbSVG } from "./thumb.svg";
import noop from "lodash.noop";

const StyledSlider = styled(ReactSlider)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 6px;
`;

const StyledThumb = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  background: var(--neutral100);
  width: 20px;
  height: 20px;
  box-shadow: var(--shadow200);
  border-radius: 4px;
  &:focus-visible {
    outline: none;
  }
  svg path {
    stroke: var(--neutral500);
  }
`;

const StyledThumbValue = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  ${(props) =>
    props.alignLeft
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `};
  display: flex;
  align-items: center;
  color: var(--textSecondary);
  white-space: nowrap;
`;

function useThumb({ min, max, range, formatValue = (val) => val }) {
  return useCallback(
    (props, state) => {
      const isActive = props.className.includes("active");
      return (
        <StyledThumb {...props}>
          <ThumbSVG />
          <StyledThumbValue alignLeft={state.valueNow <= (min + max) / 2}>
            {parseInt(range[1]) - parseInt(range[0]) > 15 || !isActive
              ? formatValue(state.valueNow)
              : ""}
          </StyledThumbValue>
        </StyledThumb>
      );
    },
    [formatValue, min, max, range],
  );
}

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props) =>
    props.index === 2
      ? "var(--neutral300)"
      : props.index === 1
      ? "var(--pink200)"
      : "var(--neutral300)"};
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

export default function Slider({
  min,
  max,
  onChange = noop,
  formatValue,
  defaultValue,
}) {
  const [range, setRange] = useState(defaultValue || [min, max]);
  const [show, setShow] = useState(false);
  const Thumb = useThumb({ min, max, range, formatValue });

  useEffect(() => setShow(true), []);

  useEffect(() => {
    setRange(defaultValue || [min, max]);
  }, [defaultValue, min, max]);

  useEffect(() => {
    onChange(range);
  }, [range, onChange]);

  if (!show) {
    return null;
  }

  return (
    <StyledSlider
      min={min}
      max={max}
      value={range}
      renderTrack={Track}
      renderThumb={Thumb}
      onChange={setRange}
    />
  );
}
