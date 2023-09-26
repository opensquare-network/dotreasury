import { forwardRef } from "react";
import { cn } from "../utils";

const Button = forwardRef(function ButtonComponent(props = {}, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "py-2 px-4 rounded bg-pink500 text-textPrimaryContrast p-14-medium",
        props.className,
      )}
    />
  );
});

export default Button;
