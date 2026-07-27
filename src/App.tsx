import { useEffect, useMemo, useState } from 'react'
import { CohortFunnelBar } from './components/CohortFunnelBar'
import { CreatorTable } from './components/CreatorTable'
import { PrototypeFab } from './components/PrototypeFab'
import { RightRail } from './components/RightRail'
import { CreatorTableSkeleton, ProgressSkeleton, RailSkeleton } from './components/Skeletons'
import { StageChips } from './components/StageChips'
import { StageRailBar } from './components/StageRailBar'
import { StatRow } from './components/StatRow'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { DEFAULT_SCENARIO, SCENARIOS } from './data/fixtures'
import { STAGES, type Selection } from './data/types'
import type { VersionId } from './data/versions'
import { useCampaignFunnel } from './hooks/useCampaignFunnel'

export default function App() {
  const [version, setVersion] = useState<VersionId>('v1')
  const [scenarioId, setScenarioId] = useState(DEFAULT_SCENARIO)
  const [fabOpen, setFabOpen] = useState(false)

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[3]
  const [selection, setSelection] = useState<Selection>(scenario.initialSelection ?? { kind: 'all' })

  // Swapping fixtures resets the filter to whatever that scenario wants to show.
  useEffect(() => {
    setSelection(scenario.initialSelection ?? { kind: 'all' })
  }, [scenario])

  // Esc closes the switcher first, then clears the filter from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (fabOpen) setFabOpen(false)
      else setSelection({ kind: 'all' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fabOpen])

  const campaign = scenario.campaign
  const funnel = useCampaignFunnel(campaign)

  const visible = useMemo(() => {
    switch (selection.kind) {
      case 'stage':
        return funnel.active.filter((c) => c.stage === selection.id)
      case 'flagged':
        return funnel.flagged
      case 'exited':
        return funnel.exited
      default:
        return campaign.creators
    }
  }, [selection, funnel, campaign])

  const filterLabel =
    selection.kind === 'stage'
      ? STAGES.find((s) => s.id === selection.id)?.label
      : selection.kind === 'flagged'
        ? 'Needs you'
        : selection.kind === 'exited'
          ? 'Exited'
          : undefined

  const loading = scenario.status === 'loading'

  return (
    /* The page itself never scrolls. The sidebar and the campaign header are
       fixed panes; only <main> scrolls, so content passes under the header. */
    <div className="flex h-screen flex-col overflow-hidden">
      {/* overflow-y must be pinned: leaving it `visible` next to overflow-x:auto
          makes the browser compute it to `auto`, which would steal the vertical
          scroll from <main> and drag the sidebar and header along with it. */}
      <div className="flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden bg-canvas">
        <div className="flex min-h-0 min-w-[1512px] flex-1">
          <Sidebar />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <TopBar title={campaign.name} status={campaign.status} />

            <main id="main" className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[1216px] pb-[64px] pl-[32px] pr-[28px] pt-[24px]">
                {scenario.status === 'error' ? (
                  <ErrorState />
                ) : (
                  <>
                    {loading ? (
                      <ProgressSkeleton version={version} />
                    ) : (
                      <div className="flex flex-col gap-[16px]">
                        <StatRow funnel={funnel} note={campaign.forecastNote} />
                        {version === 'v1' ? (
                          <>
                            <CohortFunnelBar
                              funnel={funnel}
                              selection={selection}
                              onSelect={setSelection}
                            />
                            <StageChips funnel={funnel} selection={selection} onSelect={setSelection} />
                          </>
                        ) : (
                          <StageRailBar funnel={funnel} selection={selection} onSelect={setSelection} />
                        )}
                      </div>
                    )}

                    <div className="mt-[24px] flex items-start gap-[20px]">
                      {loading ? (
                        <>
                          <CreatorTableSkeleton />
                          <RailSkeleton />
                        </>
                      ) : (
                        <>
                          <CreatorTable
                            creators={visible}
                            cohortSize={funnel.cohortSize}
                            filtered={selection.kind !== 'all'}
                            filterLabel={filterLabel}
                            onClearFilter={() => setSelection({ kind: 'all' })}
                          />
                          <RightRail campaign={campaign} funnel={funnel} />
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      <PrototypeFab
        open={fabOpen}
        onOpenChange={setFabOpen}
        version={version}
        onVersionChange={setVersion}
        scenario={scenarioId}
        onScenarioChange={setScenarioId}
      />
    </div>
  )
}

function ErrorState() {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#f0d7d7] bg-[#fdf6f6] px-[24px] py-[28px]"
    >
      <p className="text-[16px] font-bold text-default-text-base">This campaign didn’t load</p>
      <p className="max-w-[560px] text-[14px] leading-[20px] text-default-text-medium">
        We couldn’t reach the campaign service. Nothing is lost — your creators and their progress are safe.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-[6px] rounded-[10px] bg-accent-text px-[16px] py-[9px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}
