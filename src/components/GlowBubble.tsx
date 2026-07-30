interface GlowBubbleProps {
  size: number;
  left: number;
  top: number;
  className?: string;
}

export function GlowBubble({ size, left, top, className = "" }: GlowBubbleProps) {
  return (
    <div
      className={`glow-bubble ${className}`}
      style={{ left, top, width: size, height: size }}
    />
  );
}
