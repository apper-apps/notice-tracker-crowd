import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const variants = {
    primary: "bg-navy-600 hover:bg-navy-700 text-white border-navy-600 hover:border-navy-700",
    secondary: "bg-primary-500 hover:bg-primary-600 text-white border-primary-500 hover:border-primary-600",
    accent: "bg-accent-500 hover:bg-accent-600 text-white border-accent-500 hover:border-accent-600",
    outline: "bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border-transparent",
    danger: "bg-error hover:bg-red-700 text-white border-error hover:border-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md border font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;