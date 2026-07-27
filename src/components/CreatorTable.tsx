import { useState } from 'react'
import type { Creator } from '../data/types'
import { EXIT_TEXT, FLAG_TEXT, STAGES, STAGE_INDEX } from '../data/types'
import { Chevron, ICON, SymbolTile } from './icons'

export interface CreatorTableProps {
  creators: Creator[]
  cohortSize: number
  filtered: boolean
  filterLabel?: string
  onClearFilter: () => void
}

export function CreatorTable({
  creators,
  cohortSize,
  filtered,
  filterLabel,
  onClearFilter,
}: CreatorTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section
      className="w-[766px] shrink-0 overflow-hidden rounded-[16px] border border-default-border-base bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.03)]"
      aria-label="Creators"
    >
      {/* header — 64px */}
      <div className="flex h-[64px] items-center justify-between border-b border-default-border-base px-[20px]">
        <div className="flex items-center gap-[12px]">
          <SymbolTile src={ICON.group} />
          <div className="flex flex-col gap-[2px]">
            <p className="text-[14px] font-bold text-black">Creators</p>
            <p className="text-[12px] text-default-text-medium">
              {filtered
                ? `${creators.length} of ${cohortSize} ${cohortSize === 1 ? 'creator' : 'creators'}`
                : `${cohortSize} ${cohortSize === 1 ? 'creator' : 'creators'}`}
            </p>
          </div>
        </div>
        {filtered && (
          <button
            type="button"
            onClick={onClearFilter}
            className="flex h-[28px] items-center gap-[6px] rounded-full border border-default-border-base bg-white px-[12px] text-[12px] font-semibold text-default-text-base transition-colors hover:border-[#c9c9c9]"
          >
            Show all
            <span className="text-default-text-medium">✕</span>
            {filterLabel && <span className="sr-only">— clears the {filterLabel} filter</span>}
          </button>
        )}
      </div>

      {/* column headers — 39px */}
      <div className="relative h-[39px] border-b border-default-border-base bg-[#fafafa] text-[12px] font-semibold text-default-text-medium">
        <span className="absolute left-[20px] top-[12px]">CREATOR</span>
        <span className="absolute left-[262px] top-[12px]">LATEST UPDATE</span>
        <span className="absolute left-[593px] top-[12px]">STAGE</span>
      </div>

      {creators.length === 0 ? (
        <EmptyState filtered={filtered} filterLabel={filterLabel} onClearFilter={onClearFilter} />
      ) : (
        <div>
          {creators.map((creator, i) => (
            <Row
              key={creator.id}
              creator={creator}
              first={i === 0}
              open={expanded === creator.id}
              onToggle={() => setExpanded(expanded === creator.id ? null : creator.id)}
            />
          ))}
        </div>
      )}

      <div className="pb-[21px] pl-[24px] pt-[16px]">
        <button
          type="button"
          className="flex h-[24px] items-center gap-[8px] text-[16px] font-semibold text-accent-text"
        >
          <span className="relative block size-[24px] shrink-0">
            <img src={ICON.plus} alt="" className="absolute left-[3px] top-[3px] block size-[18px] max-w-none" />
          </span>
          Request more
        </button>
      </div>
    </section>
  )
}

function Row({
  creator,
  first,
  open,
  onToggle,
}: {
  creator: Creator
  first: boolean
  open: boolean
  onToggle: () => void
}) {
  const exited = Boolean(creator.exit)
  const reached = STAGE_INDEX[creator.stage]

  const update = exited
    ? EXIT_TEXT[creator.exit!]
    : creator.flag
      ? FLAG_TEXT[creator.flag]
      : creator.latestUpdate

  return (
    <div className={`border-b border-default-border-base ${first ? 'border-t' : ''}`}>
      <div className="relative h-[64px]">
        <div className="absolute left-[20px] top-[14px] flex items-center gap-[8px]">
          <span className="block size-[36px] shrink-0 overflow-hidden rounded-full bg-white">
            <img
              src={creator.avatarUrl}
              alt=""
              className={`block size-full max-w-none object-cover ${exited ? 'grayscale opacity-60' : ''}`}
            />
          </span>
          <span className="flex h-[36px] flex-col">
            <span className="flex items-center gap-[8px]">
              <span className={`text-[14px] font-medium ${exited ? 'text-muted-600' : 'text-ink-800'}`}>
                {creator.name}
              </span>
              {creator.verified && (
                <span className="relative block size-[16px] shrink-0 overflow-hidden">
                  <img
                    src={ICON.checkCircle}
                    alt="Verified"
                    className={`absolute left-1/2 top-1/2 block size-[13.901px] max-w-none -translate-x-1/2 -translate-y-1/2 ${
                      exited ? 'grayscale' : ''
                    }`}
                  />
                </span>
              )}
            </span>
            <span className="text-[12px] text-muted-600">{creator.handle}</span>
          </span>
        </div>

        <p
          className={`absolute left-[262px] top-[22.5px] max-w-[320px] truncate text-[14px] ${
            creator.flag && !exited ? 'font-medium text-flag' : 'text-default-text-medium'
          }`}
        >
          {creator.flag && !exited && <span aria-hidden>⚑ </span>}
          {update}
        </p>

        {/* Stage indicator — one dash per stage (7), filled up to `stage` */}
        <div
          className="absolute left-[593px] top-[30px] flex items-center gap-[4px]"
          role="img"
          aria-label={
            exited
              ? `Exited at ${STAGES[reached].label}`
              : `Stage ${reached + 1} of ${STAGES.length}: ${STAGES[reached].label}`
          }
        >
          {STAGES.map((stage, i) => (
            <span
              key={stage.id}
              className="block h-[4px] w-[12px] rounded-[2px]"
              style={{
                background:
                  i <= reached
                    ? exited
                      ? '#c4c4c4'
                      : 'var(--color-accent-text)'
                    : 'var(--color-default-border-base)',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`${open ? 'Hide' : 'Show'} stage history for ${creator.name}`}
          className="absolute left-[734px] top-1/2 -translate-y-1/2"
        >
          <Chevron dir={open ? 'up' : 'down'} className="transition-transform duration-200" />
        </button>
      </div>

      {open && (
        <div className="border-t border-dashed border-default-border-base bg-[#fcfcfc] px-[20px] py-[16px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.6px] text-default-text-medium">
            Stage history
          </p>
          <ol className="mt-[10px] flex flex-col gap-[6px]">
            {STAGES.slice(0, reached + 1).map((stage) => (
              <li key={stage.id} className="flex items-center gap-[8px] text-[13px] text-default-text-base">
                <span className="block size-[8px] rounded-full" style={{ background: stage.fill }} />
                {stage.label}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

function EmptyState({
  filtered,
  filterLabel,
  onClearFilter,
}: {
  filtered: boolean
  filterLabel?: string
  onClearFilter: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-[8px] px-[20px] py-[72px] text-center">
      {filtered ? (
        <>
          <p className="text-[15px] font-semibold text-default-text-base">
            Nobody is in {filterLabel ?? 'this filter'} right now
          </p>
          <p className="max-w-[380px] text-[13px] text-default-text-medium">
            The stage is empty at the moment. Clear the filter to see the rest of the cohort.
          </p>
          <button
            type="button"
            onClick={onClearFilter}
            className="mt-[8px] rounded-full border border-default-border-base px-[14px] py-[7px] text-[13px] font-semibold text-default-text-base transition-colors hover:border-[#c9c9c9]"
          >
            Show all creators
          </button>
        </>
      ) : (
        <>
          <p className="text-[15px] font-semibold text-default-text-base">No creators yet</p>
          <p className="max-w-[380px] text-[13px] text-default-text-medium">
            Approve the shortlist and invites go out the same day. Everyone you invite shows up here.
          </p>
        </>
      )}
    </div>
  )
}
