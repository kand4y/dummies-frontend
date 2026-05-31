import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
  secondary:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 disabled:text-gray-300",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
