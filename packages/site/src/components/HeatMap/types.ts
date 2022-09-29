import { ReactNode } from "react";

type Data = { type: "active" | "negative" | "inActive" } & Record<string, any>;
type DotStyle = "rect" | "circle";

export type HeatMapProps = {
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

  showTooltip?: boolean | ((data: Data) => boolean);
  tooltipContentRender?(data: Data): ReactNode;

  /**
   * @default "rect"
   */
  dotStyle: DotStyle;
};
