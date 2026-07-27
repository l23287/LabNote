interface BlobBackgroundProps {
  variant?: "onboarding" | "subtle";
}

export function BlobBackground({ variant = "subtle" }: BlobBackgroundProps) {
  if (variant === "onboarding") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="blob blob-float w-72 h-72 -top-10 -left-16"
          style={{ background: "var(--color-primary)" }}
        />
        <div
          className="blob blob-float w-64 h-64 top-1/3 -right-20"
          style={{ background: "var(--color-accent)", animationDelay: "2s" }}
        />
        <div
          className="blob blob-float w-56 h-56 bottom-10 -left-10"
          style={{ background: "var(--color-sun)", animationDelay: "4s" }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="blob w-56 h-56 -top-16 -right-16 opacity-20"
        style={{ background: "var(--color-primary)" }}
      />
      <div
        className="blob w-48 h-48 top-1/2 -left-20 opacity-20"
        style={{ background: "var(--color-accent)" }}
      />
    </div>
  );
}
