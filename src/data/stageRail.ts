import type { StageId } from './types'

/**
 * V2 stage rail — fills and copy taken from Figma node 11638:139353
 * ("State 1: Campaign Beginning", second iteration).
 *
 * The frame ships an eight-column ramp whose first column is a pre-funnel
 * "Casting…" stage. The shared data model has no such state, and V1 and V2 must
 * render the same cohort to be comparable, so that column is not drawn here —
 * see NOTES.md. Every remaining column keeps the exact fill the frame gives to
 * that named stage.
 *
 * `ink` differs from the frame on two fills: see the contrast note in NOTES.md.
 */
export interface RailStage {
  fill: string
  ink: string
  /** Sub-label under the column; some read off live counts, some are static. */
  hint: (count: number, funnelTotal: number) => string
}

export const RAIL: Record<StageId, RailStage> = {
  invited: {
    fill: '#b9dfcb',
    ink: 'var(--color-stage-ink)',
    hint: () => 'invites go out on approval',
  },
  accepted: {
    fill: '#8fceae',
    ink: 'var(--color-stage-ink)',
    hint: (n) => (n ? `${n} placing orders now` : 'waiting on replies'),
  },
  orderPlaced: {
    fill: '#5fb98c',
    ink: 'var(--color-stage-ink)',
    hint: (n) => (n ? `${n} ${n === 1 ? 'shipment' : 'shipments'} in transit` : 'nothing in transit'),
  },
  orderReceived: {
    fill: '#30aa70',
    ink: 'var(--color-stage-ink)',
    hint: () => 'once packages land',
  },
  draftSubmitted: {
    // Figma: #1c9c65 — a dead zone where neither white nor dark ink clears 4.5:1.
    fill: '#17864f',
    ink: '#ffffff',
    hint: () => 'after filming',
  },
  contentPublished: {
    fill: '#1a6f4c',
    ink: '#ffffff',
    hint: () => 'after our checks',
  },
  thanked: {
    fill: '#124a33',
    ink: '#ffffff',
    hint: () => 'after posts go live',
  },
}
