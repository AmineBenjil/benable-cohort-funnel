export type StageId =
  | 'invited'
  | 'accepted'
  | 'orderPlaced'
  | 'orderReceived'
  | 'draftSubmitted'
  | 'contentPublished'
  | 'thanked'

export type ExitReason = 'declined' | 'expired' | 'dropped' | 'undeliverable'
export type FlagKind = 'approval' | 'review' | 'stalled' | 'overdue'

export interface Creator {
  id: string
  name: string
  handle: string
  avatarUrl: string
  verified: boolean
  /** Furthest stage reached. */
  stage: StageId
  /** e.g. "Cleared the Memphis hub" */
  latestUpdate: string
  /** Blocked at `stage` — a flag on the creator, not a stage of its own. */
  flag?: FlagKind
  /** Left the funnel; excluded from the completion percentage. */
  exit?: ExitReason
}

export interface Campaign {
  name: string
  status: 'active' | 'draft' | 'wrapped'
  /** Display string for the list card, e.g. "Jul 15, 2026". */
  launchDate?: string
  /** Short descriptor shown under the title on the list card. */
  tag?: string
  dayOfPlan: number
  planLength: number
  industryAverageDays: number
  forecastNote: string
  creators: Creator[]
}

export interface StageMeta {
  id: StageId
  label: string
  /** Segment fill. */
  fill: string
  /** Count colour that clears 4.5:1 against `fill`. */
  ink: string
  /** Chip dot. */
  dot: string
}

export const STAGES: readonly StageMeta[] = [
  { id: 'invited', label: 'Invited', fill: 'var(--color-stage-1)', ink: 'var(--color-stage-ink)', dot: 'var(--color-stage-1)' },
  { id: 'accepted', label: 'Accepted', fill: 'var(--color-stage-2)', ink: 'var(--color-stage-ink)', dot: 'var(--color-stage-2)' },
  { id: 'orderPlaced', label: 'Order placed', fill: 'var(--color-stage-3)', ink: 'var(--color-stage-ink)', dot: 'var(--color-stage-3)' },
  { id: 'orderReceived', label: 'Order received', fill: 'var(--color-stage-4)', ink: 'var(--color-stage-ink)', dot: 'var(--color-stage-4)' },
  { id: 'draftSubmitted', label: 'Draft submitted', fill: 'var(--color-stage-5)', ink: '#ffffff', dot: 'var(--color-stage-5)' },
  { id: 'contentPublished', label: 'Content published', fill: 'var(--color-stage-6)', ink: '#ffffff', dot: 'var(--color-stage-6)' },
  { id: 'thanked', label: 'Thanked', fill: 'var(--color-stage-7)', ink: '#ffffff', dot: 'var(--color-stage-7)' },
] as const

export const STAGE_INDEX: Record<StageId, number> = STAGES.reduce(
  (acc, s, i) => ({ ...acc, [s.id]: i }),
  {} as Record<StageId, number>,
)

export const FLAG_TEXT: Record<FlagKind, string> = {
  approval: 'needs your approval',
  review: 'draft waiting on your review',
  stalled: 'stalled in shipping',
  overdue: 'past posting window',
}

export const EXIT_TEXT: Record<ExitReason, string> = {
  declined: 'Declined the invite',
  expired: 'Invite expired — never responded',
  dropped: 'Dropped out mid-campaign',
  undeliverable: 'Order undeliverable',
}

/** Selection is one of: nothing, a stage, every flagged creator, or the exits. */
export type Selection = { kind: 'all' } | { kind: 'stage'; id: StageId } | { kind: 'flagged' } | { kind: 'exited' }

export const selectionKey = (s: Selection) => (s.kind === 'stage' ? `stage:${s.id}` : s.kind)
