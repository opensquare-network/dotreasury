import { forwardRef } from "react";
import { cn } from "../utils";

function Button(props = {}, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "py-2 px-4 rounded bg-pink500 text-textPrimaryContrast",
        props.className,
      )}
    />
  );
}

export default forwardRef(Button);
