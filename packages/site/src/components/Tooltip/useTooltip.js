import { useState } from "react";
import { createPopper } from "@popperjs/core";

export function useTooltip({
  triggerRef,
  popperRef,
  showTooltip = true,
  offset = [0, 8],
}) {
  const [visible, setVisible] = useState(false);

  function show() {
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

    setVisible(true);
  }

  function hide() {
    if (!showTooltip) {
      return;
    }

    setVisible(false);
  }

  return {
    visible,
    show,
    hide,
  };
}
