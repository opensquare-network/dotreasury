import styled from "styled-components";
import { useRef, useState } from "react";
import { TooltipArrow, TooltipContainer } from "./styled";
import {
  useFloating,
  flip,
  shift,
  arrow,
  offset,
  autoUpdate,
} from "@floating-ui/react";

const Wrapper = styled.div`
  display: inline-flex;
`;

export default function Tooltip({ children, tooltipContent }) {
  const [open, setOpen] = useState(false);

  const arrowRef = useRef(null);

  const { middlewareData, placement, refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
  });

  function show() {
    setOpen(true);
  }

  function hide() {
    setOpen(false);
  }

  return (
    <Wrapper
      ref={refs.setReference}
      onMouseEnter={show}
      onFocus={show}
      onMouseLeave={hide}
      onBlur={hide}
    >
      {children}
      {open && tooltipContent && (
        <TooltipContainer
          ref={refs.setFloating}
          data-show={open}
          data-placement={placement}
          style={floatingStyles}
        >
          {tooltipContent}
          <TooltipArrow x={middlewareData?.arrow?.x} ref={arrowRef} />
        </TooltipContainer>
      )}
    </Wrapper>
  );
}
