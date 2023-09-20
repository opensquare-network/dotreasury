// https://d3-graph-gallery.com/graph/circularpacking_template.html

import * as d3 from "d3";
import { renderToString } from "react-dom/server";
import { useEffect, useMemo } from "react";
import { MD_SIZE, SM_SIZE } from "../../../../site/src/styles/responsive";
import { useWindowSize } from "usehooks-ts";
import { getChainSettings } from "../../utils/chains";
import { toPrecision } from "../../../../site/src/utils";

export default function ProjectBubbleGroup({
  width,
  height,
  data = [],
  sizeField = "value",
  renderBubbleToHTMLString = () => {},
}) {
  const sizeMin = Math.min(width, height);
  const windowSize = useWindowSize();

  const bubbleSizeRange = useMemo(() => {
    if (windowSize.width < SM_SIZE) {
      return [12, sizeMin / 2 - 60];
    }
    if (windowSize.width < MD_SIZE) {
      return [14, sizeMin / 2 - 40];
    }

    // lg size
    return [16, 220];
  }, [windowSize, sizeMin]);

  const nodes = data
    .map((d) => {
      const { decimals } = getChainSettings(d.chain);
      const amount = toPrecision(d.balance, decimals, false);
      const value = amount * d.price;

      return {
        ...d,
        [sizeField]: Number(d[sizeField]),
        amount,
        value,
      };
    })
    .sort((a, b) => b[sizeField] - a[sizeField]);

  useEffect(() => {
    d3.select("#project_bubbles").selectAll("*").remove();
    const [min, max] = d3.extent(nodes, (d) => d[sizeField]);
    const size = d3.scaleLinear().domain([min, max]).range(bubbleSizeRange);

    const bubblesContainer = d3.select("#project_bubbles");

    const node = bubblesContainer
      .append("div")
      .style("width", width + "px")
      .style("height", height + "px")
      .style("position", "relative")
      .selectAll("div")
      .data(nodes)
      .join("div")
      .style("position", "absolute")
      .style("left", `${width / 2}px`)
      .style("top", `${height / 2}px`)
      .style("width", (d) => `${size(d[sizeField]) * 2}px`)
      .style("height", (d) => `${size(d[sizeField]) * 2}px`);

    const simulation = d3
      .forceSimulation()
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(0.1))
      .force(
        "collide",
        d3
          .forceCollide()
          .strength(0.2)
          .radius((d) => size(d[sizeField]) + 3)
          .iterations(1),
      );

    simulation.nodes(nodes).on("tick", function () {
      node
        .style("left", (d) => `${d.x - size(d[sizeField])}px`)
        .style("top", (d) => `${d.y - size(d[sizeField])}px`)
        .attr("class", (d) => {
          const r = size(d[sizeField]);
          const d_size = r * 2;

          return `rounded-full animate-project-bubble ${getBubbleAnimationDirection(
            d_size,
          )}`;
        })
        .html((node) => {
          const r = size(node.value);
          const d = r * 2;
          const nodeData = { ...node, r, d };

          const bubbleContent = renderBubbleToHTMLString?.(nodeData);
          return renderToString(bubbleContent);
        });
    });
  }, [
    width,
    height,
    nodes,
    sizeField,
    bubbleSizeRange,
    renderBubbleToHTMLString,
  ]);

  return <div id="project_bubbles"></div>;
}

function getBubbleAnimationDirection(size = 0) {
  const prefix = "animate-project-bubble-";

  if (size > 200) {
    return `${prefix}lg`;
  } else if (size < 60) {
    return `${prefix}sm`;
  } else {
    return `${prefix}md`;
  }
}
