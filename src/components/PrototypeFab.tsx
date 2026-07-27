import { useEffect, useRef } from 'react'
import { SCENARIOS } from '../data/fixtures'
import { VERSIONS, type VersionId } from '../data/versions'
import { Chevron } from './icons'

export interface PrototypeFabProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  version: VersionId
  onVersionChange: (id: VersionId) => void
  scenario: string
  onScenarioChange: (id: string) => void
}

/**
 * Dev-only. Collapsed it reads as a status pill — current version and state at a
 * glance — and opens into the full switcher so it never covers the design.
 */
export function PrototypeFab({
  open,
  onOpenChange,
  version,
  onVersionChange,
  scenario,
  onScenarioChange,
}: PrototypeFabProps) {
  const root = useRef<HTMLDivElement>(null)
  const active = VERSIONS.find((v) => v.id === version) ?? VERSIONS[0]
  const activeScenario = SCENARIOS.find((s) => s.id === scenario)

  // Click-outside closes; Esc is handled in App so it can fall through to the filter.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) onOpenChange(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, onOpenChange])

  return (
    <div ref={root} className="fixed bottom-[24px] right-[24px] z-40 flex flex-col items-end gap-[10px]">
      {open && (
        <div
          role="dialog"
          aria-label="Prototype switcher"
          className="flex w-[320px] flex-col overflow-hidden rounded-[16px] border border-default-border-base bg-white shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
        >
          <div className="flex items-center justify-between border-b border-default-border-base px-[16px] py-[12px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-default-text-medium">
              Prototype
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close switcher"
              className="text-[14px] leading-none text-default-text-medium transition-colors hover:text-default-text-base"
            >
              ✕
            </button>
          </div>

          {/* Version */}
          <div className="border-b border-default-border-base px-[16px] py-[14px]">
            <p className="mb-[10px] text-[11px] font-semibold uppercase tracking-[0.8px] text-default-text-medium">
              Version
            </p>
            <div className="grid grid-cols-2 gap-[8px]">
              {VERSIONS.map((v) => {
                const on = v.id === version
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onVersionChange(v.id)}
                    className={[
                      'flex flex-col items-start gap-[2px] rounded-[10px] border px-[12px] py-[9px] text-left transition-colors',
                      on
                        ? 'border-accent-text bg-accent-bg-light'
                        : 'border-default-border-base bg-white hover:border-[#c9c9c9]',
                    ].join(' ')}
                  >
                    <span
                      className={`text-[13px] font-bold ${on ? 'text-accent-text' : 'text-default-text-base'}`}
                    >
                      {v.name}
                    </span>
                    <span className="text-[11px] leading-[14px] text-default-text-medium">{v.caption}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-[10px] text-[11px] leading-[15px] text-default-text-medium">{active.detail}</p>
          </div>

          {/* Scenario */}
          <div className="flex min-h-0 flex-col">
            <p className="px-[16px] pb-[6px] pt-[14px] text-[11px] font-semibold uppercase tracking-[0.8px] text-default-text-medium">
              State
            </p>
            <ul className="max-h-[290px] overflow-y-auto pb-[10px]">
              {SCENARIOS.map((s) => {
                const on = s.id === scenario
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => onScenarioChange(s.id)}
                      className={[
                        'flex w-full items-center justify-between gap-[8px] px-[16px] py-[8px] text-left text-[13px] transition-colors',
                        on
                          ? 'bg-accent-bg-light font-semibold text-accent-text'
                          : 'text-default-text-base hover:bg-[#f6f6f6]',
                      ].join(' ')}
                    >
                      {s.label}
                      {on && <span aria-hidden>✓</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => onOpenChange(!open)}
        className="flex h-[44px] items-center gap-[10px] rounded-full border border-default-border-base bg-white pl-[14px] pr-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-shadow hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
      >
        <span className="rounded-full bg-accent-text px-[8px] py-[3px] text-[11px] font-bold leading-[14px] text-white">
          {active.name}
        </span>
        <span className="max-w-[150px] truncate text-[13px] font-medium text-default-text-base">
          {activeScenario?.label ?? 'State'}
        </span>
        <Chevron dir={open ? 'down' : 'up'} />
      </button>
    </div>
  )
}
