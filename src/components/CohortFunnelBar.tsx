import { useRef, type CSSProperties, type ReactNode } from 'react'
import type { Funnel, StageBucket } from '../hooks/useCampaignFunnel'
import { EXIT_TEXT, type Selection, selectionKey } from '../data/types'
import { TooltipLayer, useSegmentTooltip, type Tip } from './segmentTooltip'

const EASE = 'cubic-bezier(.22,1,.36,1)'
const TRANSITION = `flex-grow 600ms ${EASE}, flex-basis 600ms ${EASE}, opacity 200ms linear, transform 200ms ${EASE}`

/** flex-basis floor so a 1-creator stage stays wide enough to read its count. */
const BASIS = 44
/** Width a zero-count stage collapses to — visible, but clearly not a cohort. */
const SLIVER = 14

export interface CohortFunnelBarProps {
  funnel: Funnel
  selection: Selection
  onSelect: (next: Selection) => void
}

export function CohortFunnelBar({ funnel, selection, onSelect }: CohortFunnelBarProps) {
  const { stages, activeCount, exitedCount, exitBreakdown, completionPct, cohortSize } = funnel
  const listRef = useRef<HTMLDivElement>(null)
  const { tip, pos, tipId, show, hide } = useSegmentTooltip()

  const cohortEmpty = cohortSize === 0
  const selectedKey = selectionKey(selection)
  const filtering = selection.kind !== 'all'

  const stageTip = (stage: StageBucket): Tip => ({
    key: `stage:${stage.id}`,
    title: stage.label,
    summary: `${stage.count} of ${activeCount} here · ${stage.reachedPct}% reached this stage or beyond`,
    rows: stage.creators.slice(0, 6).map((c) => c.name),
    more: Math.max(0, stage.count - 6),
  })

  /** ← / → walk the bar, skipping segments nobody is sitting in. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    const nodes = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('button[data-segment]:not([disabled])') ?? [],
    )
    const here = nodes.indexOf(document.activeElement as HTMLButtonElement)
    if (here === -1) return
    event.preventDefault()
    nodes[here + (event.key === 'ArrowRight' ? 1 : -1)]?.focus()
  }

  return (
    <>
      <div
        ref={listRef}
        role="group"
        aria-label={
          completionPct === null ? 'Creator funnel: not started' : `Creator funnel: ${completionPct}% through`
        }
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) hide()
        }}
        className="flex h-[36px] w-full gap-[3px]"
      >
        {stages.map((stage, i) => {
          const empty = stage.count === 0
          const key = `stage:${stage.id}`
          const active = selectedKey === key
          const flaggedHighlight = selection.kind === 'flagged' && stage.flagged > 0

          return (
            <Segment
              key={stage.id}
              bounds={listRef}
              tipId={tip?.key === key ? tipId : undefined}
              style={{
                flexGrow: cohortEmpty ? 1 : empty ? 0 : stage.count,
                flexShrink: empty ? 0 : 1,
                flexBasis: cohortEmpty ? 0 : empty ? SLIVER : BASIS,
              }}
              fillClass={empty || cohortEmpty ? 'hatch-empty' : ''}
              fill={empty || cohortEmpty ? undefined : stage.fill}
              radius={{
                left: i === 0 ? 100 : 6,
                right: i === stages.length - 1 && exitedCount === 0 ? 100 : 6,
              }}
              disabled={empty}
              selected={active}
              dimmed={filtering && !active && !flaggedHighlight}
              highlighted={flaggedHighlight}
              label={`${stage.label}: ${stage.count} of ${activeCount} creators${
                stage.flagged > 0 ? `, ${stage.flagged} needing you` : ''
              }${empty ? ', no creators here' : ''}`}
              onActivate={() => onSelect(active ? { kind: 'all' } : { kind: 'stage', id: stage.id })}
              onShow={(el) => show(el, listRef.current, stageTip(stage))}
              onHide={hide}
              badge={stage.flagged > 0 ? stage.flagged : undefined}
            >
              {!empty && (
                <span className="truncate px-[6px] text-[13px] font-semibold" style={{ color: stage.ink }}>
                  {stage.count}
                </span>
              )}
            </Segment>
          )
        })}

        {exitedCount > 0 && (
          <>
            {/* 20px separation from the funnel = 3px gap + 14px rule + 3px gap */}
            <div aria-hidden className="flex w-[14px] shrink-0 items-stretch justify-center">
              <span className="w-px border-l border-dashed border-[#d4d8d4]" />
            </div>
            <Segment
              bounds={listRef}
              tipId={tip?.key === 'exited' ? tipId : undefined}
              style={{ flexGrow: exitedCount, flexShrink: 1, flexBasis: BASIS }}
              fillClass="hatch"
              radius={{ left: 6, right: 100 }}
              selected={selectedKey === 'exited'}
              dimmed={filtering && selectedKey !== 'exited'}
              label={`Exited: ${exitedCount} of ${cohortSize} creators, excluded from the completion percentage`}
              onActivate={() => onSelect(selectedKey === 'exited' ? { kind: 'all' } : { kind: 'exited' })}
              onShow={(el) =>
                show(el, listRef.current, {
                  key: 'exited',
                  title: 'Exited',
                  summary: `${exitedCount} left the funnel and can’t advance`,
                  rows: exitBreakdown.map((e) => `${e.count} · ${EXIT_TEXT[e.reason].toLowerCase()}`),
                  more: 0,
                })
              }
              onHide={hide}
            >
              <span className="truncate px-[6px] text-[13px] font-semibold text-exited-ink">
                {exitedCount}
              </span>
            </Segment>
          </>
        )}
      </div>

      <TooltipLayer tip={tip} pos={pos} id={tipId} />
    </>
  )
}

interface SegmentProps {
  style: CSSProperties
  bounds: React.RefObject<HTMLDivElement | null>
  fill?: string
  fillClass?: string
  radius: { left: number; right: number }
  disabled?: boolean
  selected: boolean
  dimmed: boolean
  highlighted?: boolean
  label: string
  badge?: number
  tipId?: string
  onActivate: () => void
  onShow: (el: HTMLElement | null) => void
  onHide: () => void
  children: ReactNode
}

function Segment({
  style,
  fill,
  fillClass = '',
  radius,
  disabled,
  selected,
  dimmed,
  highlighted,
  label,
  badge,
  tipId,
  onActivate,
  onShow,
  onHide,
  children,
}: SegmentProps) {
  const wrapper = useRef<HTMLDivElement>(null)

  return (
    <div ref={wrapper} className="relative min-w-0" style={{ ...style, transition: TRANSITION }}>
      <button
        type="button"
        data-segment
        disabled={disabled}
        aria-pressed={disabled ? undefined : selected}
        aria-describedby={tipId}
        onClick={disabled ? undefined : onActivate}
        onMouseEnter={() => onShow(wrapper.current)}
        onMouseLeave={onHide}
        onFocus={() => onShow(wrapper.current)}
        className={[
          'flex h-[36px] w-full items-center justify-center',
          fillClass,
          disabled ? 'cursor-default' : 'cursor-pointer',
          selected ? '-translate-y-[2px] shadow-[0_4px_10px_rgba(0,0,0,0.14)]' : '',
          dimmed ? 'opacity-[0.38]' : '',
          highlighted ? 'outline-2 outline-offset-1 outline-flag' : '',
        ].join(' ')}
        style={{
          background: fill,
          borderTopLeftRadius: radius.left,
          borderBottomLeftRadius: radius.left,
          borderTopRightRadius: radius.right,
          borderBottomRightRadius: radius.right,
          transition: `opacity 200ms linear, transform 200ms ${EASE}`,
        }}
      >
        <span className="sr-only">{label}</span>
        <span aria-hidden className="flex min-w-0 items-center justify-center">
          {children}
        </span>
      </button>

      {badge !== undefined && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-[7px] right-[1px] flex h-[14px] min-w-[21px] items-center justify-center rounded-full border-[1.5px] border-white bg-flag px-[6px] text-[10px] font-extrabold leading-none tracking-[0.0923px] text-white drop-shadow-[0px_1px_2px_rgba(180,83,9,0.28)]"
        >
          {badge}
        </span>
      )}
    </div>
  )
}
