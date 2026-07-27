import { useCallback, useEffect, useId, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

export interface Tip {
  key: string
  title: string
  summary: string
  rows: string[]
  more: number
}

/**
 * Shared by both bar versions. <main> is a scroll container, so a tooltip
 * absolutely positioned above a segment would be clipped by it — this measures
 * against the viewport and portals out, clamped to the bar's own edges.
 */
export function useSegmentTooltip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [pos, setPos] = useState<CSSProperties | null>(null)
  const tipId = useId()

  // The tooltip is positioned against the viewport, so any scroll invalidates it.
  useEffect(() => {
    if (!tip) return
    const drop = () => setTip(null)
    window.addEventListener('scroll', drop, true)
    return () => window.removeEventListener('scroll', drop, true)
  }, [tip])

  const show = useCallback((anchor: HTMLElement | null, bounds: HTMLElement | null, next: Tip) => {
    if (anchor) {
      const seg = anchor.getBoundingClientRect()
      const bar = (bounds ?? anchor).getBoundingClientRect()
      const center = seg.left + seg.width / 2
      const bottom = window.innerHeight - seg.top + 10
      setPos(
        center - bar.left < 160
          ? { bottom, left: bar.left }
          : bar.right - center < 160
            ? { bottom, left: bar.right, transform: 'translateX(-100%)' }
            : { bottom, left: center, transform: 'translateX(-50%)' },
      )
    }
    setTip(next)
  }, [])

  const hide = useCallback(() => setTip(null), [])

  return { tip, pos, tipId, show, hide }
}

export function TooltipLayer({ tip, pos, id }: { tip: Tip | null; pos: CSSProperties | null; id: string }) {
  if (!tip || !pos) return null

  return createPortal(
    <div
      id={id}
      role="tooltip"
      style={pos}
      className="pointer-events-none fixed z-50 w-max max-w-[300px] rounded-[10px] bg-[#1c1c1c] px-[12px] py-[10px] text-left text-white shadow-[0_8px_24px_rgba(0,0,0,0.24)]"
    >
      <p className="text-[13px] font-semibold">{tip.title}</p>
      <p className="mt-[2px] text-[12px] leading-[16px] text-[#c9c9c9]">{tip.summary}</p>
      {tip.rows.length > 0 && (
        <>
          <span className="my-[8px] block h-px bg-white/15" />
          <ul className="space-y-[3px] text-[12px] leading-[16px]">
            {tip.rows.map((row) => (
              <li key={row}>{row}</li>
            ))}
            {tip.more > 0 && <li className="text-[#c9c9c9]">+{tip.more} more</li>}
          </ul>
        </>
      )}
    </div>,
    document.body,
  )
}
