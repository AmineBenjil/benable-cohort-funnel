import { useRef } from 'react'
import { RAIL } from '../data/stageRail'
import { EXIT_TEXT, type Selection, selectionKey } from '../data/types'
import type { Funnel, StageBucket } from '../hooks/useCampaignFunnel'
import { TooltipLayer, useSegmentTooltip, type Tip } from './segmentTooltip'

/**
 * V2 of the cohort bar (Figma 11638:139353).
 *
 * Where V1 sizes each segment by headcount, this one gives every stage an equal
 * column and carries the reading in the label + hint underneath. That makes the
 * stage names legible without a chip row, which is why V2 has none.
 */
export interface StageRailBarProps {
  funnel: Funnel
  selection: Selection
  onSelect: (next: Selection) => void
}

export function StageRailBar({ funnel, selection, onSelect }: StageRailBarProps) {
  const { stages, activeCount, exitedCount, exitBreakdown, completionPct, cohortSize } = funnel
  const listRef = useRef<HTMLDivElement>(null)
  const { tip, pos, tipId, show, hide } = useSegmentTooltip()

  const selectedKey = selectionKey(selection)
  const filtering = selection.kind !== 'all'

  const stageTip = (stage: StageBucket): Tip => ({
    key: `stage:${stage.id}`,
    title: stage.label,
    summary: `${stage.count} of ${activeCount} here · ${stage.reachedPct}% reached this stage or beyond`,
    rows: stage.creators.slice(0, 6).map((c) => c.name),
    more: Math.max(0, stage.count - 6),
  })

  /** ← / → walk the rail, skipping columns nobody is sitting in. */
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

  const columns = stages.length + (exitedCount > 0 ? 1 : 0)

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
        className="flex w-full items-start justify-center gap-[4px]"
      >
        {stages.map((stage, i) => {
          const rail = RAIL[stage.id]
          const key = `stage:${stage.id}`
          const active = selectedKey === key
          const empty = stage.count === 0
          const flaggedHighlight = selection.kind === 'flagged' && stage.flagged > 0

          return (
            <Column
              key={stage.id}
              label={stage.label}
              hint={rail.hint(stage.count, activeCount)}
              count={stage.count}
              fill={empty ? undefined : rail.fill}
              fillClass={empty ? 'hatch-empty' : ''}
              ink={empty ? 'var(--color-exited-ink)' : rail.ink}
              radius={{ left: i === 0 ? 74 : 4, right: i === stages.length - 1 && exitedCount === 0 ? 100 : 4 }}
              disabled={empty}
              selected={active}
              dimmed={filtering && !active && !flaggedHighlight}
              highlighted={flaggedHighlight}
              a11yLabel={`${stage.label}: ${stage.count} of ${activeCount} creators${
                stage.flagged > 0 ? `, ${stage.flagged} needing you` : ''
              }${empty ? ', no creators here' : ''}`}
              badge={stage.flagged || undefined}
              onActivate={() => onSelect(active ? { kind: 'all' } : { kind: 'stage', id: stage.id })}
              onBadge={() => onSelect(selectedKey === 'flagged' ? { kind: 'all' } : { kind: 'flagged' })}
              tipId={tip?.key === key ? tipId : undefined}
              onShow={(el) => show(el, listRef.current, stageTip(stage))}
              onHide={hide}
            />
          )
        })}

        {exitedCount > 0 && (
          <Column
            label="Exited"
            hint={exitedCount === 1 ? 'left the funnel' : `${exitedCount} left the funnel`}
            count={exitedCount}
            fillClass="hatch"
            ink="var(--color-exited-ink)"
            radius={{ left: 4, right: 100 }}
            selected={selectedKey === 'exited'}
            dimmed={filtering && selectedKey !== 'exited'}
            a11yLabel={`Exited: ${exitedCount} of ${cohortSize} creators, excluded from the completion percentage`}
            onActivate={() => onSelect(selectedKey === 'exited' ? { kind: 'all' } : { kind: 'exited' })}
            tipId={tip?.key === 'exited' ? tipId : undefined}
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
          />
        )}

        {/* Keeps the rail full-width when a lone column would otherwise stretch. */}
        {columns === 1 && <span aria-hidden className="flex-1" />}
      </div>

      <TooltipLayer tip={tip} pos={pos} id={tipId} />
    </>
  )
}

interface ColumnProps {
  label: string
  hint: string
  count: number
  fill?: string
  fillClass?: string
  ink: string
  radius: { left: number; right: number }
  disabled?: boolean
  selected: boolean
  dimmed: boolean
  highlighted?: boolean
  a11yLabel: string
  badge?: number
  onActivate: () => void
  onBadge?: () => void
  tipId?: string
  onShow: (el: HTMLElement | null) => void
  onHide: () => void
}

function Column({
  label,
  hint,
  count,
  fill,
  fillClass = '',
  ink,
  radius,
  disabled,
  selected,
  dimmed,
  highlighted,
  a11yLabel,
  badge,
  onActivate,
  onBadge,
  tipId,
  onShow,
  onHide,
}: ColumnProps) {
  const bar = useRef<HTMLButtonElement>(null)

  return (
    <div
      className={`relative flex min-w-0 flex-1 flex-col gap-[8px] transition-opacity duration-200 ${
        dimmed ? 'opacity-[0.38]' : ''
      }`}
    >
      <button
        ref={bar}
        type="button"
        data-segment
        disabled={disabled}
        aria-pressed={disabled ? undefined : selected}
        aria-describedby={tipId}
        onClick={disabled ? undefined : onActivate}
        onMouseEnter={() => onShow(bar.current)}
        onMouseLeave={onHide}
        onFocus={() => onShow(bar.current)}
        className={[
          'flex h-[40px] w-full items-center justify-center',
          fillClass,
          disabled ? 'cursor-default' : 'cursor-pointer',
          selected ? '-translate-y-[2px] shadow-[0_4px_10px_rgba(0,0,0,0.14)]' : '',
          highlighted ? 'outline-2 outline-offset-1 outline-flag' : '',
        ].join(' ')}
        style={{
          background: fill,
          borderTopLeftRadius: radius.left,
          borderBottomLeftRadius: radius.left,
          borderTopRightRadius: radius.right,
          borderBottomRightRadius: radius.right,
          transition: 'transform 200ms cubic-bezier(.22,1,.36,1), box-shadow 200ms linear',
        }}
      >
        <span className="sr-only">{a11yLabel}</span>
        <span
          aria-hidden
          className="text-[13px] font-bold leading-[16.9px] tracking-[-0.0762px]"
          style={{ color: ink }}
        >
          {count}
        </span>
      </button>

      {badge !== undefined && (
        <button
          type="button"
          onClick={onBadge}
          aria-label={`${badge} ${badge === 1 ? 'creator needs' : 'creators need'} you in ${label}`}
          className="absolute -top-[7px] right-[3px] flex h-[14px] min-w-[21px] items-center justify-center rounded-full border-[1.5px] border-white bg-flag px-[6px] text-[10px] font-extrabold leading-none tracking-[0.0923px] text-white drop-shadow-[0px_1px_2px_rgba(180,83,9,0.28)]"
        >
          {badge}
        </button>
      )}

      {/* Fixed height (16.25 title + two 16.1 hint lines) so columns stay level
          whether or not a hint wraps, and the loading skeleton can match it. */}
      <div className="flex h-[49px] flex-col items-start overflow-hidden pl-[8px] pr-[7px]">
        <p className="text-[12.5px] font-semibold leading-[16.25px] tracking-[-0.0366px] text-ink-600">
          {label}
        </p>
        <p className="line-clamp-2 text-[11.5px] leading-[16.1px] tracking-[0.0337px] text-[#9a9a9a]">
          {hint}
        </p>
      </div>
    </div>
  )
}
