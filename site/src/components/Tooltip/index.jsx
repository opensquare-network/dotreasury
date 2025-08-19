import styled from "styled-components";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  max-width: 100%;
`;

export default function Tooltip({ children, tooltipContent, className = "" }) {
  const [open, setOpen] = useState(false);

  const arrowRef = useRef(null);

  const { middlewareData, placement, refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
  });

  function show() {
    setOpen(true);
  }

  function hide() {
    setOpen(false);
  }

  const tooltipElement = open && tooltipContent && (
    <TooltipContainer
      ref={refs.setFloating}
      data-show={open}
      data-placement={placement}
      style={floatingStyles}
    >
      {tooltipContent}
      <TooltipArrow x={middlewareData?.arrow?.x} ref={arrowRef} />
    </TooltipContainer>
  );

  return (
    <Wrapper
      ref={refs.setReference}
      onMouseEnter={show}
      onFocus={show}
      onMouseLeave={hide}
      onBlur={hide}
      className={className}
    >
      {children}
      {tooltipElement && createPortal(tooltipElement, document.body)}
    </Wrapper>
  );
}
