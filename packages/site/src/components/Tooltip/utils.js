import { createPopper } from "@popperjs/core";

export function showTooltip(target, popper, options) {
  const { placement = "top", offset = [0, 8] } = options ?? {};

  /** @type {import("@popperjs/core").Instance | undefined} */
  let instance;

  if (instance) {
    instance.destroy();
  }

  instance = createPopper(target, popper, {
    placement,
    modifiers: [
      {
        name: "flip",
        options: {
          fallbackPlacements: [placement],
        },
      },
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
