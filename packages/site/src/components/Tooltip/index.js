import styled from "styled-components";
import { useRef } from "react";
import { useTooltip } from "./useTooltip";
import { TooltipArrow, TooltipContainer } from "./styled";

const Wrapper = styled.div`
  display: inline-flex;
`;

export default function Tooltip({
  children,
  showTooltip,
  tooltipContent,
  offset,
}) {
  const refElement = useRef(null);
  const tooltipElement = useRef(null);

  const { tooltipVisible, handleShowTooltip, handleHideTooltip } = useTooltip({
    triggerRef: refElement,
    popperRef: tooltipElement,
    showTooltip,
    offset,
  });

  return (
    <Wrapper
      ref={refElement}
      onMouseEnter={handleShowTooltip}
      onFocus={handleShowTooltip}
      onMouseLeave={handleHideTooltip}
      onBlur={handleHideTooltip}
    >
      {children}
      {showTooltip && (
        <TooltipContainer ref={tooltipElement} data-show={tooltipVisible}>
          {tooltipContent}
          <TooltipArrow data-popper-arrow />
        </TooltipContainer>
      )}
    </Wrapper>
  );
}
