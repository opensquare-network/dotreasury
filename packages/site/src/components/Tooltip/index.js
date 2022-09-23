import styled from "styled-components";
import { useRef } from "react";
import { useTooltip } from "./useTooltip";
import { TooltipArrow, TooltipContainer } from "./styled";

const Wrapper = styled.div`
  display: inline-flex;
`;

export default function Tooltip({
  children,
  showTooltip = true,
  tooltipContent,
  tooltipOffset,
}) {
  const refElement = useRef(null);
  const tooltipElement = useRef(null);

  const { visible, show, hide } = useTooltip({
    triggerRef: refElement,
    popperRef: tooltipElement,
    showTooltip,
    offset: tooltipOffset,
  });

  return (
    <Wrapper
      ref={refElement}
      onMouseEnter={show}
      onFocus={show}
      onMouseLeave={hide}
      onBlur={hide}
    >
      {children}
      {showTooltip && (
        <TooltipContainer ref={tooltipElement} data-show={visible}>
          {tooltipContent}
          <TooltipArrow data-popper-arrow />
        </TooltipContainer>
      )}
    </Wrapper>
  );
}
