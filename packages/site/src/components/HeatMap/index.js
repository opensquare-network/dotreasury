import React from "react";
import {
  HeatMapLegendWrapper,
  HeatMapWrapper,
  HeatMapLegendContent,
  HeatMapLegend,
  HeatMapDot,
  HeatMapContent,
} from "./styled";
import Tooltip from "../../components/Tooltip";
import { noop } from "rxjs";

/**
 * @typedef {{ type: "active" | "negative" | "inActive" } & Record<string, any>} Data
 * @typedef {"rect" | "circle"} DotStyle
 * @param {{
    data: Data[];

    negative?: boolean;

    activeColor?: string;
    negativeColor?: string;
    inActiveColor?: string;

    legend?: boolean;
    legendActiveText?: string;
    legendNegativeText?: string;
    legendInactiveText?: string;

    showTooltip?: boolean | ((data: Data) => boolean);
    tooltipContentRender?(data: Data): ReactNode;

    dotStyle: DotStyle;
  }} props
 */
export default function AttendanceHeatMap(props) {
  const {
    data = [],
    negative = false,
    activeColor = "#b3ecc5",
    negativeColor = "#f2c3c3",
    inActiveColor = "var(--neutral300)",
    legend = true,
    legendActiveText = "Active",
    legendNegativeText = "Negative",
    legendInactiveText = "Inactive",
    showTooltip = true,
    tooltipContentRender = noop,
    dotStyle = "rect",
  } = props ?? {};

  function getDotColor(type) {
    const colors = {
      activeColor,
      negativeColor,
      inActiveColor,
    };

    return colors[type + "Color"];
  }

  return (
    <HeatMapWrapper>
      <HeatMapContent>
        {data?.map((i, idx) => {
          const shouldShowTooltip =
            typeof showTooltip === "function" ? showTooltip(i) : showTooltip;

          const dot = (
            <HeatMapDot
              key={idx}
              color={getDotColor(i.type)}
              dotStyle={dotStyle}
            />
          );

          return shouldShowTooltip ? (
            <Tooltip key={idx} tooltipContent={tooltipContentRender(i)}>
              {dot}
            </Tooltip>
          ) : (
            dot
          );
        })}
      </HeatMapContent>

      {legend && (
        <HeatMapLegendWrapper>
          <HeatMapLegendContent>
            <HeatMapLegend>
              <HeatMapDot color={activeColor} dotStyle={dotStyle} />
              {legendActiveText}
            </HeatMapLegend>
            {negative && (
              <HeatMapLegend>
                <HeatMapDot color={negativeColor} dotStyle={dotStyle} />
                {legendNegativeText}
              </HeatMapLegend>
            )}
            <HeatMapLegend>
              <HeatMapDot color={inActiveColor} dotStyle={dotStyle} />
              {legendInactiveText}
            </HeatMapLegend>
          </HeatMapLegendContent>
        </HeatMapLegendWrapper>
      )}
    </HeatMapWrapper>
  );
}
