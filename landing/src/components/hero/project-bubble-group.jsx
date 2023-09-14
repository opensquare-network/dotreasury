// https://d3-graph-gallery.com/graph/circularpacking_template.html

import * as d3 from "d3";
import { renderToString } from "react-dom/server";
import { useEffect, useMemo } from "react";
import { MD_SIZE, SM_SIZE } from "../../../../site/src/styles/responsive";
import { useWindowSize } from "usehooks-ts";

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
  }, [windowSize]);

  const nodes = data
    .map((d) => ({
      ...d,
      [sizeField]: parseInt(d[sizeField]),
    }))
    .sort((a, b) => b[sizeField] - a[sizeField]);

  useEffect(() => {
    d3.select("#project_bubbles").selectAll("*").remove();
    const [, max] = d3.extent(nodes, (d) => d[sizeField]);

    const size = d3.scaleLinear().domain([0, max]).range(bubbleSizeRange);

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
      .style("width", (d) => `${size(d.value) * 2}px`)
      .style("height", (d) => `${size(d.value) * 2}px`);

    const simulation = d3
      .forceSimulation()
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(0.1))
      .force(
        "collide",
        d3
          .forceCollide()
          .strength(0.2)
          .radius((d) => size(d.value) + 3)
          .iterations(1),
      );

    simulation.nodes(nodes).on("tick", function () {
      node
        .style("left", (d) => `${d.x - size(d.value)}px`)
        .style("top", (d) => `${d.y - size(d.value)}px`)
        .attr("class", "rounded-full")
        .html((node) => {
          const r = size(node.value);
          const d = r * 2;
          const nodeData = { ...node, r, d };

          const bubbleContent = renderBubbleToHTMLString?.(nodeData);
          return renderToString(bubbleContent);
        });
    });
  }, [width, height, nodes, sizeField, bubbleSizeRange]);

  return <div id="project_bubbles"></div>;
}
