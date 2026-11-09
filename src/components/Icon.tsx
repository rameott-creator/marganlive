interface IconProps {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
  strokeWidth?: number;
}

const PATHS: Record<string, React.ReactNode> = {
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M9 2v2.5M15 2v2.5M9 19.5V22M15 19.5V22M2 9h2.5M2 15h2.5M19.5 9H22M19.5 15H22" />
    </>
  ),
  code: (
    <path d="M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5M13 5l-2 14" />
  ),
  gamepad: (
    <>
      <path d="M7 8h10a5 5 0 0 1 4.9 5.9l-.9 4.6a2.6 2.6 0 0 1-4.6 1.3L15 17H9l-1.4 2.8a2.6 2.6 0 0 1-4.6-1.3l-.9-4.6A5 5 0 0 1 7 8Z" />
      <path d="M8 11v3M6.5 12.5h3" />
      <circle cx="15.5" cy="11.5" r="0.4" fill="currentColor" />
      <circle cx="18" cy="13.5" r="0.4" fill="currentColor" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9.5a15 15 0 0 1 19 0M6 13.2a10 10 0 0 1 12 0M9.5 16.8a5 5 0 0 1 5 0" />
      <circle cx="12" cy="19.6" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  chat: (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" />
      <path d="M9 11h.01M12.5 11h.01M16 11h.01" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h13v6a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5V9Z" />
      <path d="M17 10h2a2 2 0 0 1 0 4h-2M7.5 5.5c0-.8.7-.8.7-1.6M11.5 5.5c0-.8.7-.8.7-1.6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  bell: (
    <>
      <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9Z" />
      <path d="M10 20a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
  message: (
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.4-4.6A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3h.5A8.5 8.5 0 0 1 21 11.5Z" />
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  flame: (
    <path d="M12 22c4.4 0 7.2-2.8 7.2-6.9 0-3-1.6-5.4-3.3-7.4-.3 1.5-1.3 2.6-2.7 3.1.4-2.5-.8-5.4-3.6-7.3.2 3.4-1.3 4.8-2.6 6.9C7.6 13.7 5.2 15.5 5.2 18c0 2.4 2 4 4.3 4 1 0 1.8-.4 2.5-1.2" />
  ),
  bookmark: <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4.2L6 20V5a1 1 0 0 1 1-1Z" />,
  lightbulb: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6.2 6.2 0 0 0-3.6 11.2c.8.6 1.1 1.3 1.1 2.3h5c0-1 .3-1.7 1.1-2.3A6.2 6.2 0 0 0 12 3Z" />
    </>
  ),
  heart: (
    <path d="M12 20.3S4 15.4 4 9.7A4.6 4.6 0 0 1 8.6 5c1.5 0 2.6.6 3.4 1.8A4.3 4.3 0 0 1 15.4 5 4.6 4.6 0 0 1 20 9.7c0 5.7-8 10.6-8 10.6Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.3a3.5 3.5 0 0 1 0 6.4M18.3 20a5.5 5.5 0 0 0-2.3-4.4" />
    </>
  ),
  arrowLeft: <path d="M15 5l-7 7 7 7" />,
  sparkles: (
    <>
      <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3Z" />
      <path d="M19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" />
    </>
  ),
  check: <path d="M4.5 12.5 10 18 19.5 6.5" />,
  checkCheck: (
    <>
      <path d="M2.5 13l5 5L16 9.5" />
      <path d="M11.5 14.5 13 16 21 8" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.6 1.6" />
      <path d="M14 10a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.6-1.6" />
    </>
  ),
  send: <path d="M21 3 10.5 13.5M21 3l-7 18-3.5-7.5L3 10l18-7Z" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  trending: <path d="M3 17l6-6 4 4 8-8M21 11V7h-4" />,
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9.5 12 2 2 3.5-4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  zap: <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" />,
  pin: (
    <>
      <path d="M9 4h6l-1 7 3.5 2.5v2H6.5v-2L10 11 9 4Z" />
      <path d="M12 15.5V21" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.5 9.5-1.8 4.2-4.2 1.8 1.8-4.2 4.2-1.8Z" />
    </>
  ),
};

export function Icon({ name, size = 18, className = '', filled = false, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
