import type { ReactNode } from "react";
import { cx } from "../../../utils/classnames";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  className,
  disabled,
  onClick,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      className={cx(
        "min-h-12 rounded-lg px-5 font-black transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" &&
          "bg-blue-700 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-800",
        variant === "secondary" &&
          "border border-slate-300 bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
