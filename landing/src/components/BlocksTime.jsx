// copied from site/src/components/BlocksTime.jsx
// without redux, chainSymbolSelector

import BlocksTimeDefaultUnit from "./BlocksTimeDefaultUnit";

export default function BlocksTime({
  blocks,
  unitMapper = {},
  pluralUnitMapper = {},
  chain,
  ...others
}) {
  return (
    <BlocksTimeDefaultUnit
      chain={chain}
      blocks={blocks}
      unitMapper={Object.assign(
        { y: "yr", d: "day", h: "hr", s: "sec" },
        unitMapper,
      )}
      pluralUnitMapper={Object.assign(
        { y: "yrs", mon: "mons", d: "days", h: "hrs", min: "mins", s: "secs" },
        pluralUnitMapper,
      )}
      {...others}
    />
  );
}
