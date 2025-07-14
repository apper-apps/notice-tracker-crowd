import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white border border-gray-200 rounded-lg shadow-sm",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;