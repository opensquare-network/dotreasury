import { primary_yellow_100, primary_yellow_500 } from "./styles";
import { select } from "d3-selection";
import { arc } from "d3-shape";
import { useEffect, useMemo, useRef } from "react";
import { SVG } from "./styled";
import Popper from "../Popper";

export default function CountDown(props) {
  const {
    numerator = 0,
    denominator = 0,
    size = 12,
    foregroundColor = primary_yellow_500,
    backgroundColor = primary_yellow_100,
    showTooltip = true,
    tooltipContent,
  } = props ?? {};

  const svgElement = useRef(null);

  const percent = useMemo(() => {
    const v = numerator / denominator;

    if (v >= 1) {
      return 100;
    }

    return parseInt(v * 100);
  }, [numerator, denominator]);

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
    <Popper showTooltip={showTooltip} tooltipContent={tooltipContent}>
      <SVG
        ref={svgElement}
        width={size}
        height={size}
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
      />
    </Popper>
  );
}
