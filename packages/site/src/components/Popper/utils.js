export function getRects({ trigger, popper }) {
  const triggerRect = trigger.getBoundingClientRect();
  const popperRect = popper.getBoundingClientRect();

  return {
    triggerRect,
    popperRect,
  };
}

export function getRectPositions({ triggerRect, popperRect }) {
  const left =
    window.scrollX +
    triggerRect.x -
    popperRect.width / 2 +
    triggerRect.width / 2;

  const top =
    triggerRect.y + window.scrollY - popperRect.height - triggerRect.height / 2;

  return {
    left,
    top,
  };
}
