import {
  AttendanceHeatMapLegendWrapper,
  AttendanceHeatMapWrapper,
  AttendanceHeatMapLegendContent,
  AttendanceHeatMapLegend,
  AttendanceHeatMapDot,
  AttendanceHeatMapContent,
} from "./styled";
import { Greyscale_Grey_200 } from "../../constants";
import Tooltip from "../../components/Tooltip";
import { noop } from "rxjs";

/**
 * @param {import("./types").AttendanceHeatMapProps} props
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
    <AttendanceHeatMapWrapper>
      <AttendanceHeatMapContent>
        {data?.map((i, idx) => {
          const shouldShowTooltip =
            typeof showTooltip === "function" ? showTooltip(i) : showTooltip;

          const dot = (
            <AttendanceHeatMapDot
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
      </AttendanceHeatMapContent>

      {legend && (
        <AttendanceHeatMapLegendWrapper>
          <AttendanceHeatMapLegendContent>
            <AttendanceHeatMapLegend>
              <AttendanceHeatMapDot color={activeColor} dotStyle={dotStyle} />
              {legendActiveText}
            </AttendanceHeatMapLegend>
            {negative && (
              <AttendanceHeatMapLegend>
                <AttendanceHeatMapDot
                  color={negativeColor}
                  dotStyle={dotStyle}
                />
                {legendNegativeText}
              </AttendanceHeatMapLegend>
            )}
            <AttendanceHeatMapLegend>
              <AttendanceHeatMapDot color={inActiveColor} dotStyle={dotStyle} />
              {legendInactiveText}
            </AttendanceHeatMapLegend>
          </AttendanceHeatMapLegendContent>
        </AttendanceHeatMapLegendWrapper>
      )}
    </AttendanceHeatMapWrapper>
  );
}
