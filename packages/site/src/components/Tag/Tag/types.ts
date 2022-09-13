import React from "react";

export type TagProps = React.HTMLAttributes<HTMLSpanElement> & {
  rounded?: boolean;
  hoverable?: boolean;
  color?: "pink";
};
