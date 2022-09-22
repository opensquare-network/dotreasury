import {
  AttendanceHeatMapLegendWrapper,
  AttendanceHeatMapWrapper,
  AttendanceHeatMapLegendContent,
  AttendanceHeatMapLegend,
  AttendanceHeatMapDot,
  AttendanceHeatMapContent,
} from "./styled";
import { Greyscale_Grey_200 } from "../../constants";

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
  } = props ?? {};

  return (
    <AttendanceHeatMapWrapper>
      <AttendanceHeatMapContent>
        {data.map((i, idx) => (
          <AttendanceHeatMapDot key={idx} />
        ))}
      </AttendanceHeatMapContent>

      {legend && (
        <AttendanceHeatMapLegendWrapper>
          <AttendanceHeatMapLegendContent>
            <AttendanceHeatMapLegend>
              <AttendanceHeatMapDot color={activeColor} />
              {legendActiveText}
            </AttendanceHeatMapLegend>
            {negative && (
              <AttendanceHeatMapLegend>
                <AttendanceHeatMapDot color={negativeColor} />
                {legendNegativeText}
              </AttendanceHeatMapLegend>
            )}
            <AttendanceHeatMapLegend>
              <AttendanceHeatMapDot color={inActiveColor} />
              {legendInactiveText}
            </AttendanceHeatMapLegend>
          </AttendanceHeatMapLegendContent>
        </AttendanceHeatMapLegendWrapper>
      )}
    </AttendanceHeatMapWrapper>
  );
}
