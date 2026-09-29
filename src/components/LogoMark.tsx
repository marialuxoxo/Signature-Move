/**
 * Das Markenwerk-Zeichen: drei überlappende Kreise in den Druckfarben Cyan, Magenta und Gelb.
 * Wo sie sich überlagern, entstehen wie im Druck neue Farben.
 */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <g style={{ mixBlendMode: "multiply", isolation: "isolate" }}>
        <circle cx="24" cy="24" r="17" fill="#00AEEF" style={{ mixBlendMode: "multiply" }} />
        <circle cx="40" cy="24" r="17" fill="#EC008C" style={{ mixBlendMode: "multiply" }} />
        <circle cx="32" cy="38" r="17" fill="#FFE600" style={{ mixBlendMode: "multiply" }} />
      </g>
    </svg>
  );
}
