import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost";
}

export function Button({
  variant = "solid",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "cursor-pointer rounded-lg px-6 py-2.5 text-sm font-medium transition-colors",
        variant === "solid" &&
          "bg-foreground text-background hover:bg-foreground/85",
        variant === "ghost" &&
          "border border-foreground/15 text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
