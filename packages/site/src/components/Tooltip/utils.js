import { createPopper } from "@popperjs/core";

export function showTooltip(target, popper, options) {
  const { placement = "top", offset = [0, 8] } = options ?? {};

  let instance;

  instance = createPopper(target, popper, {
    strategy: "fixed",
    placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset,
        },
      },
    ],
  });

  return instance;
}
