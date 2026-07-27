import type { Funnel } from '../hooks/useCampaignFunnel'
import { type Selection, selectionKey } from '../data/types'
import { ICON } from './icons'

export interface StageChipsProps {
  funnel: Funnel
  selection: Selection
  onSelect: (next: Selection) => void
}

export function StageChips({ funnel, selection, onSelect }: StageChipsProps) {
  const selected = selectionKey(selection)

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex flex-wrap content-center items-center gap-[12px]">
        <Chip
          label="All creators"
          count={funnel.cohortSize}
          selected={selected === 'all'}
          onClick={() => onSelect({ kind: 'all' })}
          dot={<img src={ICON.dotAll} alt="" className="block size-[12px] max-w-none" />}
        />
        {funnel.stages.map((stage) => {
          const key = `stage:${stage.id}`
          return (
            <Chip
              key={stage.id}
              label={stage.label}
              count={stage.count}
              empty={stage.count === 0}
              selected={selected === key}
              onClick={() => onSelect(selected === key ? { kind: 'all' } : { kind: 'stage', id: stage.id })}
              dot={<Dot color={stage.dot} hollow={stage.count === 0} />}
            />
          )
        })}
      </div>

      {/* Meta chips cut across stages, so they sit on their own row. */}
      <div className="flex flex-wrap content-center items-center gap-[12px]">
        <Chip
          label="Needs you"
          count={funnel.flaggedCount}
          empty={funnel.flaggedCount === 0}
          selected={selected === 'flagged'}
          onClick={() => onSelect(selected === 'flagged' ? { kind: 'all' } : { kind: 'flagged' })}
          dot={<Dot color="var(--color-flag)" hollow={funnel.flaggedCount === 0} />}
        />
        <Chip
          label="Exited"
          count={funnel.exitedCount}
          empty={funnel.exitedCount === 0}
          selected={selected === 'exited'}
          onClick={() => onSelect(selected === 'exited' ? { kind: 'all' } : { kind: 'exited' })}
          dot={<Dot color="#b4b8b4" hollow={funnel.exitedCount === 0} />}
        />
      </div>
    </div>
  )
}

function Dot({ color, hollow }: { color: string; hollow?: boolean }) {
  return (
    <span
      className="block size-[12px] shrink-0 rounded-full"
      style={
        hollow
          ? { border: `1.5px dashed ${color}`, opacity: 0.8 }
          : { background: color }
      }
      aria-hidden
    />
  )
}

interface ChipProps {
  label: string
  count: number
  dot: React.ReactNode
  selected: boolean
  empty?: boolean
  onClick: () => void
}

function Chip({ label, count, dot, selected, empty, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-disabled={empty || undefined}
      onClick={empty ? undefined : onClick}
      className={[
        'flex h-[33px] shrink-0 items-center gap-[12px] rounded-[8px] border bg-white px-[12px] py-[8px] transition-[border-color,box-shadow,opacity] duration-150',
        selected
          ? 'border-default-border-strong drop-shadow-[0px_2px_1.5px_rgba(0,0,0,0.04)]'
          : 'border-default-border-base',
        empty ? 'cursor-default opacity-55' : 'cursor-pointer hover:border-[#c9c9c9]',
      ].join(' ')}
    >
      <span className="flex items-center gap-[4px]">
        {dot}
        <span className="whitespace-nowrap text-[14px] font-semibold text-default-text-base">{label}</span>
      </span>
      <span className="text-[14px] font-semibold text-default-text-medium">{count}</span>
    </button>
  )
}
