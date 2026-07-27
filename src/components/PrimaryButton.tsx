import type { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost";
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

  return (
    <button
      className={`w-full h-14 rounded-2xl font-semibold text-white disabled:opacity-40 transition active:scale-[0.98] ${className}`}
      style={{
        background: "linear-gradient(135deg, var(--color-violet), var(--color-violet-2))",
        boxShadow: "0 10px 25px rgba(139,107,255,0.35)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
