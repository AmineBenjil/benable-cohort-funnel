import type { ReactNode } from 'react'
import { SymbolTile } from './icons'

export interface SidePanelCardProps {
  icon: string
  title: string
  subtitle?: ReactNode
  children: ReactNode
}

/** The three right-rail cards share one shell: 64px header, 8px, then body. */
export function SidePanelCard({ icon, title, subtitle, children }: SidePanelCardProps) {
  return (
    <section className="w-full overflow-hidden rounded-[16px] border border-default-border-base bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.03)]">
      <div className="flex h-[64px] items-center border-b border-default-border-base px-[20px]">
        <div className="flex items-center gap-[12px]">
          <SymbolTile src={icon} />
          <div className="flex flex-col gap-[2px]">
            <p className="text-[14px] font-bold text-black">{title}</p>
            {subtitle && <p className="text-[12px] text-default-text-medium">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="px-[20px] pt-[8px]">{children}</div>
    </section>
  )
}

export interface NoteRowProps {
  emoji: string
  strong: string
  rest?: string
  last?: boolean
  /** Figma clips the first row 12px earlier so its copy wraps identically. */
  tight?: boolean
}

export function NoteRow({ emoji, strong, rest, last, tight }: NoteRowProps) {
  return (
    <div
      className={`py-[16px] ${last ? '' : 'border-b border-default-border-base'} ${tight ? 'pr-[12px]' : ''}`}
    >
      <div className="flex items-start gap-[12px]">
        <span className="shrink-0 text-[16px] leading-[20px]" aria-hidden>
          {emoji}
        </span>
        <p className="text-[14px] leading-[20px]">
          <span className="font-semibold text-default-text-base">{strong}</span>
          {rest && <span className="font-medium text-default-text-medium">{rest}</span>}
        </p>
      </div>
    </div>
  )
}
