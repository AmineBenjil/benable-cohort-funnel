/**
 * Every glyph here is an SVG exported from the Figma frame (node 11603:48887)
 * and committed under src/assets/icons. Nothing is hand-drawn — the exports
 * carry their own fills, which is why they are rendered as <img> rather than
 * inline <svg>. Each wrapper pins an explicit width AND height so the leaf
 * image can never fall back to its intrinsic size.
 */
import checkCircle from '../assets/icons/check-circle.svg'
import chevron from '../assets/icons/chevron.svg'
import dotAll from '../assets/icons/dot-all.svg'
import eye from '../assets/icons/eye.svg'
import group from '../assets/icons/group.svg'
import insight from '../assets/icons/insight.svg'
import invites from '../assets/icons/invites.svg'
import navBrandIntelligence from '../assets/icons/nav-brand-intelligence.svg'
import navCampaigns from '../assets/icons/nav-campaigns.svg'
import navPushAlerts from '../assets/icons/nav-push-alerts.svg'
import navUgc from '../assets/icons/nav-ugc.svg'
import plus from '../assets/icons/plus.svg'
import tabDot from '../assets/icons/tab-dot.svg'

export const ICON = {
  checkCircle,
  chevron,
  dotAll,
  eye,
  group,
  insight,
  invites,
  navBrandIntelligence,
  navCampaigns,
  navPushAlerts,
  navUgc,
  plus,
  tabDot,
}

/** The base chevron export points right; the frame rotates it for each use. */
export function Chevron({
  dir,
  className = '',
}: {
  dir: 'left' | 'right' | 'down' | 'up'
  className?: string
}) {
  const rotate = { right: 0, down: 90, left: 180, up: 270 }[dir]
  return (
    <span className={`relative block size-[16px] shrink-0 ${className}`} aria-hidden>
      {/* `rotate` rather than `transform`: the centring translate is its own CSS
          property in Tailwind v4, and a `transform` here would stack on top of it. */}
      <img
        src={chevron}
        alt=""
        className="absolute left-1/2 top-1/2 block h-[14.004px] w-[7.308px] max-w-none -translate-x-1/2 -translate-y-1/2"
        style={{ rotate: `${rotate}deg` }}
      />
    </span>
  )
}

/** 32px lavender tile that fronts every card header in the frame. */
export function SymbolTile({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-accent-bg-light">
      <img src={src} alt={alt} className="block h-[14px] w-[14px] max-w-none object-contain" />
    </span>
  )
}
