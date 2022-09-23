import { useState } from "react";
import { createPopper } from "@popperjs/core";

export function useTooltip({
  triggerRef,
  popperRef,
  showTooltip,
  offset = [0, 8],
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  function handleShowTooltip() {
    if (!showTooltip) {
      return;
    }

    createPopper(triggerRef.current, popperRef.current, {
      placement: "top",
      modifiers: [
        {
          name: "offset",
          options: {
            offset,
          },
        },
      ],
    });

    setTooltipVisible(true);
  }

  function handleHideTooltip() {
    if (!showTooltip) {
      return;
    }

    setTooltipVisible(false);
  }

  return {
    tooltipVisible,
    handleShowTooltip,
    handleHideTooltip,
  };
}
