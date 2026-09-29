/** Das Markenwerk-Zeichen: ein gelbes Quadrat mit einem M, wie ein Stempel. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <rect width="64" height="64" rx="14" fill="#FFD000" />
      <path d="M16 46V18h6l10 14 10-14h6v28h-7V30l-9 12-9-12v16z" fill="#1A1C1F" />
    </svg>
  );
}
