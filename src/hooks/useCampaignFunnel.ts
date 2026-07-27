import { useMemo } from 'react'
import type { Campaign, Creator, ExitReason, StageId } from '../data/types'
import { STAGES, STAGE_INDEX } from '../data/types'

export interface StageBucket {
  id: StageId
  label: string
  fill: string
  ink: string
  dot: string
  index: number
  creators: Creator[]
  count: number
  /** Creators here who are blocked and need the brand to act. */
  flagged: number
  /** Share of the surviving cohort that reached this stage or beyond. */
  reachedPct: number
}

export interface Funnel {
  /** Every creator in the campaign, exited included. */
  cohortSize: number
  /** Creators still able to advance. */
  active: Creator[]
  activeCount: number
  exited: Creator[]
  exitedCount: number
  exitBreakdown: { reason: ExitReason; count: number }[]
  flagged: Creator[]
  flaggedCount: number
  stages: StageBucket[]
  /** round(sum(stageIndex) / (activeCount * 6) * 100), exits excluded. */
  completionPct: number | null
}

const LAST_INDEX = STAGES.length - 1

export function useCampaignFunnel(campaign: Campaign): Funnel {
  return useMemo(() => {
    const creators = campaign.creators
    const active = creators.filter((c) => !c.exit)
    const exited = creators.filter((c) => c.exit)
    const flagged = active.filter((c) => c.flag)

    const stages: StageBucket[] = STAGES.map((meta, index) => {
      const inStage = active.filter((c) => c.stage === meta.id)
      const reachedOrBeyond = active.filter((c) => STAGE_INDEX[c.stage] >= index).length
      return {
        ...meta,
        index,
        creators: inStage,
        count: inStage.length,
        flagged: inStage.filter((c) => c.flag).length,
        reachedPct: active.length ? Math.round((reachedOrBeyond / active.length) * 100) : 0,
      }
    })

    const reasons: ExitReason[] = ['declined', 'expired', 'dropped', 'undeliverable']
    const exitBreakdown = reasons
      .map((reason) => ({ reason, count: exited.filter((c) => c.exit === reason).length }))
      .filter((r) => r.count > 0)

    const completionPct = active.length
      ? Math.round(
          (active.reduce((sum, c) => sum + STAGE_INDEX[c.stage], 0) / (active.length * LAST_INDEX)) * 100,
        )
      : null

    return {
      cohortSize: creators.length,
      active,
      activeCount: active.length,
      exited,
      exitedCount: exited.length,
      exitBreakdown,
      flagged,
      flaggedCount: flagged.length,
      stages,
      completionPct,
    }
  }, [campaign])
}
