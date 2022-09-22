type Data = any;

export type AttendanceHeatMapProps = {
  data: Data[];

  /**
   * @default false
   * @description enable negative
   */
  negative?: boolean;

  activeColor?: string;
  negativeColor?: string;
  inActiveColor?: string;

  /**
   * @default true
   */
  legend?: boolean;
  legendActiveText?: string;
  legendNegativeText?: string;
  legendInactiveText?: string;
};
