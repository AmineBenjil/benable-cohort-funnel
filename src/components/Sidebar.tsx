import logoTile from '../assets/brand/logo-tile.png'
import logoGlyph from '../assets/brand/logo-glyph.svg'
import wordmark from '../assets/brand/wordmark.svg'
import { ICON } from './icons'

const NAV = [
  { label: 'Campaigns', icon: ICON.navCampaigns, active: true },
  { label: 'Push Alerts', icon: ICON.navPushAlerts, active: false },
  { label: 'Brand Intelligence', icon: ICON.navBrandIntelligence, active: false },
  { label: 'UGC', icon: ICON.navUgc, active: false },
]

export function Sidebar({ onCampaignsClick }: { onCampaignsClick?: () => void }) {
  return (
    <aside
      className="relative w-[296px] shrink-0 overflow-hidden border-r-[0.5px] border-default-border-base bg-white"
      aria-label="Platform"
    >
      {/* Layer_1 — 180 x 47.225 at (12, 31.906) */}
      <div className="absolute left-[12px] top-[31.906px] h-[47.225px] w-[180px]">
        <div className="absolute left-0 top-[2.836px] size-[41.559px] overflow-hidden rounded-[9.542px]">
          <img src={logoTile} alt="" className="block size-full max-w-none object-cover" />
          <img
            src={logoGlyph}
            alt=""
            className="absolute left-[10.938px] top-[7.023px] block h-[27.352px] w-[21.202px] max-w-none"
          />
        </div>
        <img
          src={wordmark}
          alt="Benable"
          className="absolute left-[53.559px] top-1/2 block h-[19.102px] w-[93.737px] max-w-none -translate-y-1/2"
        />
      </div>

      <nav className="absolute left-[12px] top-[111.133px] flex w-[272px] flex-col gap-[12px]">
        <p className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.8px] text-[rgba(107,114,128,0.6)]">
          Platform
        </p>
        <ul className="flex flex-col gap-[12px]">
          {NAV.map((item) => (
            <li key={item.label}>
              {item.active ? (
                <a
                  href="#main"
                  aria-current="page"
                  onClick={(e) => {
                    if (!onCampaignsClick) return
                    e.preventDefault()
                    onCampaignsClick()
                  }}
                  className="flex h-[48px] w-full items-center gap-[16px] rounded-[12px] bg-accent-bg-light px-[16px] py-[12px]"
                >
                  <img src={item.icon} alt="" className="block size-[24px] max-w-none shrink-0" />
                  <span className="text-[16px] font-medium text-accent-text">{item.label}</span>
                </a>
              ) : (
                <span className="flex h-[48px] w-full items-center justify-between rounded-[12px] py-[12px] pl-[16px] pr-[8px]">
                  <span className="flex min-w-0 flex-1 items-center gap-[16px]">
                    <img src={item.icon} alt="" className="block size-[24px] max-w-none shrink-0" />
                    <span className="truncate text-[16px] font-medium text-default-text-medium">
                      {item.label}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-progress-track px-[8px] py-[3px] text-[10px] font-medium leading-[16.5px] tracking-[-0.1355px] text-black">
                    Coming soon
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
