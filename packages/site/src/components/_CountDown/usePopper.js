import { useEffect, useState } from "react";
import { createPopper } from "@popperjs/core";

export function usePopper({ refRef, popperRef, showTooltip }) {
  const [popperVisible, setPopperVisible] = useState(false);
  const [popperInstance, setPopperInstance] = useState(null);

  function showPopper() {
    setPopperVisible(true);
    popperInstance?.update?.();
  }

  function hidePopper() {
    setPopperVisible(false);
  }

  useEffect(() => {
    if (!showTooltip) {
      return;
    }

    setPopperInstance(
      createPopper(refRef.current, popperRef.current, {
        placement: "top",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      })
    );
  }, [showTooltip, refRef, popperRef]);

  return {
    popperVisible,
    showPopper,
    hidePopper,
  };
}
