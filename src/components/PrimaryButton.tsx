import type { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost" | "accent";
}

export function PrimaryButton({
  variant = "solid",
  className = "",
  children,
  ...props
}: PrimaryButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        className={`w-full h-14 rounded-2xl font-semibold text-ink bg-surface border border-border disabled:opacity-40 transition ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  const gradient =
    variant === "accent"
      ? "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))"
      : "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))";
  const shadow =
    variant === "accent" ? "0 10px 25px rgba(163,230,53,0.3)" : "0 10px 25px rgba(74,222,128,0.25)";

  return (
    <button
      className={`w-full h-14 rounded-2xl font-semibold text-white disabled:opacity-40 transition active:scale-[0.98] ${className}`}
      style={{ background: gradient, boxShadow: shadow }}
      {...props}
    >
      {children}
    </button>
  );
}
