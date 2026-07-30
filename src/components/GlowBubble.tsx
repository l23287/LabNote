interface GlowBubbleProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function GlowBubble({ size = 220, className = "", animate = true }: GlowBubbleProps) {
  return (
    <div
      className={`relative shrink-0 rounded-full ${animate ? "blob-float" : ""} ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 32% 26%, #e4ffc2 0%, #9bea6f 20%, #4fbf4a 46%, #1f7a3f 72%, #0c3319 100%)",
        boxShadow:
          "inset 0 0 0 1.5px rgba(214,255,176,0.4), inset -14px -18px 40px rgba(0,0,0,0.45), 0 0 60px 12px rgba(120,220,90,0.45), 0 0 130px 46px rgba(80,200,70,0.22)",
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: "8%",
          background: "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.5), transparent 40%)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
