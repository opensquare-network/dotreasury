// NOTE: temporary usage

import { forwardRef } from "react";
import { PopperContainer, PopperArrow } from "./styled";

function Popper({ children, visible = false, style }, ref) {
  return (
    <PopperContainer ref={ref} role="tooltip" data-show={visible} style={style}>
      {children}
      <PopperArrow data-popper-arrow />
    </PopperContainer>
  );
}

export default forwardRef(Popper);
