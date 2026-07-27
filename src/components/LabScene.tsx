export function LabScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <circle cx="330" cy="55" r="30" fill="var(--color-sun)" opacity="0.9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1={330 + Math.cos((deg * Math.PI) / 180) * 40}
          y1={55 + Math.sin((deg * Math.PI) / 180) * 40}
          x2={330 + Math.cos((deg * Math.PI) / 180) * 48}
          y2={55 + Math.sin((deg * Math.PI) / 180) * 48}
          stroke="var(--color-sun)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}

      <path d="M0 190 Q 90 140 190 185 T 400 180 V 260 H 0 Z" fill="var(--color-primary-dark)" opacity="0.9" />
      <path d="M0 215 Q 110 175 230 215 T 400 210 V 260 H 0 Z" fill="var(--color-primary)" />

      <g transform="translate(150 130)">
        <path
          d="M18 0 H 34 V 26 L 52 78 Q 56 88 46 88 H 6 Q -4 88 0 78 L 18 26 Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path d="M6 62 Q 26 48 46 62 L 46 78 Q 44 88 40 88 H 12 Q 8 88 6 78 Z" fill="var(--color-accent)" />
        <circle cx="20" cy="70" r="3" fill="white" opacity="0.7" />
        <circle cx="32" cy="60" r="2.5" fill="white" opacity="0.7" />
        <circle cx="26" cy="76" r="2" fill="white" opacity="0.6" />
        <rect x="14" y="-6" width="24" height="7" rx="2" fill="var(--color-muted-2)" />
      </g>

      <g transform="translate(235 150)">
        <path d="M8 68 Q 8 30 8 15" stroke="var(--color-primary-dark)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="8" cy="10" rx="14" ry="10" fill="var(--color-primary)" />
        <ellipse cx="-6" cy="24" rx="10" ry="7" fill="var(--color-primary)" transform="rotate(-20 -6 24)" />
        <ellipse cx="22" cy="30" rx="10" ry="7" fill="var(--color-primary)" transform="rotate(20 22 30)" />
      </g>

      <g transform="translate(70 165)">
        <rect x="0" y="0" width="34" height="42" rx="4" fill="white" fillOpacity="0.85" />
        <rect x="12" y="-4" width="10" height="8" rx="2" fill="var(--color-muted-2)" />
        <line x1="7" y1="12" x2="27" y2="12" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="7" y1="20" x2="27" y2="20" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="7" y1="28" x2="20" y2="28" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
