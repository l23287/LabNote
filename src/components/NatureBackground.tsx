function Bird({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M${x - 12 * scale} ${y} Q ${x - 6 * scale} ${y - 8 * scale} ${x} ${y} Q ${x + 6 * scale} ${y - 8 * scale} ${x + 12 * scale} ${y}`}
      stroke="#5b5a7a"
      strokeWidth={2.5 * scale}
      strokeLinecap="round"
      fill="none"
      opacity={0.55}
    />
  );
}

export function NatureBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdecc8" />
            <stop offset="32%" stopColor="#ffb37a" />
            <stop offset="58%" stopColor="#f57f6b" />
            <stop offset="80%" stopColor="#7c6394" />
            <stop offset="100%" stopColor="#443a68" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff2c4" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffcf87" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffcf87" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c5a8e" />
            <stop offset="100%" stopColor="#352a52" />
          </linearGradient>
          <linearGradient id="reflection" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1440" height="900" fill="url(#sky)" />

        <circle cx="760" cy="430" r="220" fill="url(#sunGlow)" />
        <circle cx="760" cy="430" r="86" fill="#ffe3a3" />

        <Bird x={220} y={150} scale={1.1} />
        <Bird x={270} y={175} scale={0.8} />
        <Bird x={1120} y={120} scale={1} />
        <Bird x={1170} y={100} scale={0.7} />

        {/* far mountains */}
        <path
          d="M0 560 L120 460 L230 540 L340 420 L470 530 L600 440 L760 545 L900 450 L1040 540 L1180 460 L1300 535 L1440 470 L1440 620 L0 620 Z"
          fill="#8579ad"
          opacity="0.55"
        />

        {/* mid mountains */}
        <path
          d="M0 610 L160 500 L300 590 L430 480 L560 600 L720 500 L880 605 L1020 510 L1180 600 L1320 520 L1440 595 L1440 660 L0 660 Z"
          fill="#5f5286"
          opacity="0.8"
        />

        {/* water */}
        <rect x="0" y="640" width="1440" height="260" fill="url(#water)" />
        <rect x="560" y="430" width="360" height="470" fill="url(#reflection)" opacity="0.5" />
        <g stroke="#ffe3c2" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round">
          <line x1="640" y1="700" x2="760" y2="700" />
          <line x1="700" y1="740" x2="850" y2="740" />
          <line x1="660" y1="780" x2="790" y2="780" />
          <line x1="710" y1="820" x2="840" y2="820" />
        </g>

        {/* pine trees silhouette along the shore */}
        <g fill="#1c2a22">
          {[
            [-20, 900, 60], [30, 900, 90], [90, 900, 70], [150, 900, 110],
            [230, 900, 80], [1280, 900, 100], [1340, 900, 75], [1400, 900, 95],
            [1230, 900, 65],
          ].map(([x, base, h], i) => (
            <g key={i} transform={`translate(${x} 0)`}>
              <polygon points={`30,${base - h} 0,${base} 60,${base}`} />
              <polygon points={`30,${base - h * 0.65} 8,${base - h * 0.15} 52,${base - h * 0.15}`} opacity="0.95" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
