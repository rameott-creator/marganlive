interface EqBarsProps {
  className?: string;
  size?: number;
}

/** Фирменный знак «живая волна» — 4 анимированные полоски эквалайзера. */
export function EqBars({ className = '', size = 14 }: EqBarsProps) {
  return (
    <svg
      className={`eq-bars ${className}`}
      viewBox="0 0 17 12"
      width={size}
      height={Math.round((size * 12) / 17)}
      aria-hidden="true"
      focusable="false"
    >
      <rect className="eq-bar eq-bar--1" x="0" y="7" width="3" height="5" rx="0.7" />
      <rect className="eq-bar eq-bar--2" x="4.7" y="2" width="3" height="10" rx="0.7" />
      <rect className="eq-bar eq-bar--3" x="9.3" y="4.6" width="3" height="7.4" rx="0.7" />
      <rect className="eq-bar eq-bar--4" x="14" y="0.6" width="3" height="11.4" rx="0.7" />
    </svg>
  );
}
