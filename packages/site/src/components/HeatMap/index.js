import {
  HeatMapLegendWrapper,
  HeatMapWrapper,
  HeatMapLegendContent,
  HeatMapLegend,
  HeatMapDot,
  HeatMapContent,
} from "./styled";
import { Greyscale_Grey_200 } from "../../constants";
import Tooltip from "../../components/Tooltip";
import { noop } from "rxjs";

/**
 * @param {import("./types").HeatMapProps} props
 */
export default function AttendanceHeatMap(props) {
  const {
    data = [],
    negative = false,
    activeColor = "#b3ecc5",
    negativeColor = "#f2c3c3",
    inActiveColor = Greyscale_Grey_200,
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
