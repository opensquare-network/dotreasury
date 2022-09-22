import styled from "styled-components";
import { useRef } from "react";
import { usePopper } from "./usePopper";
import { PopperArrow, PopperContainer } from "./styled";

const Wrapper = styled.div`
  display: inline-flex;
`;

export default function Popper({ children, showTooltip, tooltipContent }) {
  const refElement = useRef(null);
  const popperElement = useRef(null);
  const arrowElement = useRef(null);

  const { popperVisible, hidePopper, showPopper } = usePopper({
    refRef: refElement,
    popperRef: popperElement,
    showTooltip,
  });

  return (
    <Wrapper
      ref={refElement}
      onMouseEnter={showPopper}
      onFocus={showPopper}
      onMouseLeave={hidePopper}
      onBlur={hidePopper}
    >
      {children}
      {showTooltip && (
        <PopperContainer ref={popperElement} data-show={popperVisible}>
          {tooltipContent}
          <PopperArrow ref={arrowElement} data-popper-arrow />
        </PopperContainer>
      )}
    </Wrapper>
  )
}
