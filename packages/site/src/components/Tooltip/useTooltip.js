import { useState } from "react";
import { showTooltip as showTooltipFn } from "./utils";

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

    const instance = showTooltipFn(triggerRef.current, popperRef.current, {
      offset,
    });
    instance?.update?.();
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
