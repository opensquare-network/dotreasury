import React from "react";
import BlocksTimeDefaultUnit from "./BlocksTimeDefaultUnit";

export default function BlocksTime({
  blocks,
  unitMapper = {},
  pluralUnitMapper = {},
  ...others
}) {
  return (
    <BlocksTimeDefaultUnit
      blocks={blocks}
      unitMapper={Object.assign(
        { y: "yr", d: "day", h: "hr", s: "sec" },
        unitMapper
      )}
      pluralUnitMapper={Object.assign(
        { y: "yrs", mon: "mons", d: "days", h: "hrs", min: "mins", s: "secs" },
        pluralUnitMapper
      )}
      {...others}
    />
  );
}
