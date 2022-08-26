import { primary_yellow_100, primary_yellow_500 } from "./styles";
import { select } from "d3-selection";
import { arc } from "d3-shape";
import { useEffect, useMemo, useRef } from "react";
import {
  CountDownWrapper,
  PopperArrow,
  PopperContainer,
  PopperInfoDiffHeight,
  PopperInfoHeight,
  SVG,
} from "./styled";
import { usePopper } from "./usePopper";
export default function CountDown(props) {
  const {
    blockHeight = 0,
    startBlockHeight = 0,
    endBlockHeight = 0,
    size = 12,
    foregroundColor = primary_yellow_500,
    backgroundColor = primary_yellow_100,
    showTooltip = true,
  } = props ?? {};

  const svgElement = useRef(null);
  const popperElement = useRef(null);
  const arrowElement = useRef(null);

  const { popperVisible, hidePopper, showPopper } = usePopper({
    refRef: svgElement,
    popperRef: popperElement,
    showTooltip,
  });

  const diffHeight = useMemo(() => {
    if (blockHeight > endBlockHeight) {
      return 0;
    }

    return endBlockHeight - blockHeight;
  }, [endBlockHeight, blockHeight]);

  const percent = useMemo(() => {
    const v =
      (blockHeight - startBlockHeight) / (endBlockHeight - startBlockHeight);

    if (v >= 1) {
      return 100;
    }

    return parseInt(v * 100);
  }, [blockHeight, endBlockHeight, startBlockHeight]);

  useEffect(() => {
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2;
    const angle = (2 * Math.PI * percent) / 100;

    const svgEl = select(svgElement.current);
    svgEl.selectAll("*").remove();
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${outerRadius},${outerRadius})`);

    const arc1 = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(angle);
    svg.append("path").attr("d", arc1).style("stroke-width", "0");

    const arc2 = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(angle)
      .endAngle(2 * Math.PI);
    svg.append("path").attr("d", arc2).style("stroke-width", "0");
  }, [percent, size, svgElement]);

  return (
    <CountDownWrapper
      onMouseEnter={showPopper}
      onFocus={showPopper}
      onMouseLeave={hidePopper}
      onBlur={hidePopper}
    >
      <SVG
        ref={svgElement}
        width={size}
        height={size}
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
      />

      {showTooltip && (
        <PopperContainer ref={popperElement} data-show={popperVisible}>
          <div>
            <PopperInfoDiffHeight>{diffHeight}</PopperInfoDiffHeight>
            <PopperInfoHeight>
              {blockHeight} / {endBlockHeight}
            </PopperInfoHeight>
          </div>
          <PopperArrow ref={arrowElement} data-popper-arrow />
        </PopperContainer>
      )}
    </CountDownWrapper>
  );
}
