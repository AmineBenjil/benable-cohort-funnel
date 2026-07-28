import { useState } from 'react'
import { NEXT_CAMPAIGN } from '../data/fixtures'
import type { Campaign } from '../data/types'
import type { Funnel } from '../hooks/useCampaignFunnel'
import { Chevron, ICON } from './icons'

export interface CampaignListPageProps {
  campaign: Campaign
  funnel: Funnel
  /** The brand's own name for the campaign; empty until they set one. */
  campaignName: string
  onRenameCampaign: (name: string) => void
  onOpenCampaign: () => void
}

/** The layer before the detail dashboard — Figma node 11679:14330. The page
    header sits directly on the canvas; there is no white top bar here. */
export function CampaignListPage({
  campaign,
  funnel,
  campaignName,
  onRenameCampaign,
  onOpenCampaign,
}: CampaignListPageProps) {
  return (
    <main id="main" className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1216px] pb-[64px] pl-[32px] pr-[28px] pt-[40px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <h1 className="text-[24px] font-extrabold tracking-[-0.25px] text-ink-700">Overview</h1>
            <p className="text-[14px] tracking-[0.07px] text-default-text-medium">
              Manage your active campaigns and creator relationships.
            </p>
          </div>
          {/* Present in the frame at opacity 0 — reserved for a later state. */}
          <div
            aria-hidden
            className="flex h-[44px] items-center justify-center gap-[8px] rounded-[12px] bg-accent-text py-[14px] pl-[16px] pr-[24px] opacity-0"
          >
            <span className="relative block size-[16px] shrink-0">
              <img
                src={ICON.plus}
                alt=""
                className="absolute left-1/2 top-1/2 block size-[14px] max-w-none -translate-x-1/2 -translate-y-1/2"
              />
            </span>
            <span className="text-[16px] font-medium text-white">Create Campaign</span>
          </div>
        </div>

        <div className="mt-[20px] flex flex-col gap-[24px]">
          <ActiveCampaignCard
            campaign={campaign}
            funnel={funnel}
            name={campaignName}
            onRename={onRenameCampaign}
            onOpen={onOpenCampaign}
          />
          <LockedCampaignCard />
        </div>
      </div>
    </main>
  )
}

const STATUS_LABEL = { active: 'Live', draft: 'Draft', wrapped: 'Wrapped' } as const

function ActiveCampaignCard({
  campaign,
  funnel,
  name,
  onRename,
  onOpen,
}: {
  campaign: Campaign
  funnel: Funnel
  name: string
  onRename: (name: string) => void
  onOpen: () => void
}) {
  const filmingCount = funnel.stages.find((s) => s.id === 'draftSubmitted')?.count ?? 0

  return (
    <section className="relative h-[288px] w-full overflow-hidden rounded-[32px] border-[0.5px] border-default-border-base bg-white shadow-[0px_4px_32px_0px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0px_6px_36px_0px_rgba(0,0,0,0.07)]">
      {/* Started date + auto-title + status pill */}
      <div className="absolute left-[24px] top-[24px] flex flex-col gap-[12px]">
        <p className="text-[14px] font-medium text-default-text-medium">
          Started, {campaign.launchDate}
        </p>
        <div className="flex items-center gap-[16px]">
          <p className="text-[24px] font-bold leading-[32px] tracking-[-0.25px] text-default-text-base">
            Campaign 1
          </p>
          <span className="flex items-center rounded-full border border-[#2baf87] bg-[#effbf7] px-[16px] py-[4px]">
            <span className="text-[14px] font-semibold text-green-stat">
              {STATUS_LABEL[campaign.status]}
            </span>
          </span>
        </div>
      </div>

      <CampaignNameRow name={name} onRename={onRename} />

      {/* The way into the detail dashboard */}
      <button
        type="button"
        onClick={onOpen}
        className="absolute right-[24px] top-[24px] flex items-center gap-[8px] rounded-[8px] border border-default-border-base bg-white py-[8px] pl-[20px] pr-[12px] transition-colors hover:bg-[#fafafa]"
      >
        <span className="text-[14px] font-semibold text-default-text-base">All details</span>
        <Chevron dir="right" />
      </button>

      {/* Progress panel — soft white-over-gradient wash */}
      <div
        className="absolute left-[24px] right-[24px] top-[152px] h-[112px] overflow-hidden rounded-[12px] border-[0.5px] border-[#eaecf6]"
        style={{
          backgroundImage:
            'linear-gradient(176.56deg, rgb(255,255,255) 22.8%, rgba(255,255,255,0.8) 95.78%), linear-gradient(-80.48deg, rgb(165,187,219) 42.7%, rgb(110,81,252) 94.37%)',
        }}
      >
        {funnel.completionPct === null ? (
          <p className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] font-medium text-default-text-medium">
            {funnel.cohortSize === 0
              ? 'No creators yet — invites go out once you approve the shortlist'
              : 'Nobody is moving right now — everyone has exited this campaign'}
          </p>
        ) : (
          <>
            <div className="absolute left-[14px] top-[16px] flex items-end gap-[7px]">
              <p className="text-[40px] font-extrabold tracking-[0.3711px] text-accent-text">
                {funnel.completionPct}%
              </p>
              <div className="flex h-[48px] items-end justify-center pb-[5px]">
                <p className="text-[14px] font-medium tracking-[-0.1504px] text-accent-text">
                  complete
                </p>
              </div>
            </div>

            <div className="absolute right-[16px] top-[47px] flex items-center gap-[5px]">
              <p className="text-[14px] font-medium tracking-[-0.1504px] text-default-text-medium">
                {funnel.activeCount} of {funnel.cohortSize} creators active
              </p>
              <img src={ICON.dot4} alt="" className="block size-[4px] max-w-none" />
              <p className="text-[14px] font-medium tracking-[-0.1504px] text-default-text-medium">
                {filmingCount} filming
              </p>
              {funnel.flaggedCount > 0 && (
                <>
                  <img src={ICON.dot4} alt="" className="block size-[4px] max-w-none" />
                  <p className="text-[14px] font-medium tracking-[-0.1504px] text-[#e88e2c]">
                    {funnel.flaggedCount} need your attention
                  </p>
                </>
              )}
            </div>

            <div
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={funnel.completionPct}
              aria-label="Campaign completion"
              className="absolute left-[14px] right-[16px] top-[80px] h-[16px] overflow-hidden rounded-[84px] border-[0.5px] border-[#ece8ff] bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]"
            >
              {funnel.completionPct > 0 && (
                <div
                  className="shimmer-accent absolute bottom-px left-px top-px rounded-[44px]"
                  style={{ width: `calc(${funnel.completionPct}% - 2px)` }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/** Inline campaign-name editor: click the line (or the pencil) to type,
    Enter or clicking away saves, Esc cancels. */
function CampaignNameRow({ name, onRename }: { name: string; onRename: (name: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  const startEditing = () => {
    setDraft(name)
    setEditing(true)
  }

  const commit = () => {
    onRename(draft.trim())
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="absolute left-[24px] top-[109px] flex w-[545px] items-center gap-[22px]">
        <input
          autoFocus
          type="text"
          value={draft}
          placeholder="You add a campaign name here..."
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="-mx-[9px] -my-[5px] w-full rounded-[8px] border border-accent-text bg-white px-[8px] py-[4px] text-[16px] leading-[24px] text-default-text-base caret-accent-text outline-none placeholder:text-[#aaaaaa]"
          aria-label="Campaign name"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      aria-label={name ? `Rename campaign ${name}` : 'Name this campaign'}
      className="group absolute left-[24px] top-[109px] flex cursor-text items-center gap-[22px]"
    >
      {name ? (
        <p className="text-[16px] leading-[24px] text-default-text-base">{name}</p>
      ) : (
        <p className="text-[16px] leading-[24px] text-[#aaaaaa] transition-colors group-hover:text-default-text-medium">
          You add a campaign name here...
        </p>
      )}
      <span className="relative block size-[16px] shrink-0 cursor-pointer opacity-70 transition-opacity group-hover:opacity-100">
        <img
          src={ICON.edit}
          alt=""
          className="absolute left-1/2 top-1/2 block size-[14px] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </span>
    </button>
  )
}

function LockedCampaignCard() {
  const { unlockInDays, unlockDate } = NEXT_CAMPAIGN

  return (
    <section
      aria-label={`Next campaign locked, unlocks in ${unlockInDays} days`}
      className="relative h-[96px] w-full select-none overflow-hidden rounded-[24px] border-[0.5px] border-default-border-base"
      style={{
        backgroundColor: '#f1f3f5',
        /* Figma stripes: 3.846px bars rotated -54.54deg, 21.03px apart on x.
           Perpendicular period = 21.03 * sin(35.46deg) ≈ 12.2px. */
        backgroundImage:
          'repeating-linear-gradient(35.46deg, transparent 0 8.35px, rgba(229,229,229,0.5) 8.35px 12.2px)',
      }}
    >
      {/* 48px hourglass; the export carries its own glow, hence the oversized inset */}
      <span className="absolute left-[24px] top-1/2 block size-[48px] -translate-y-1/2">
        <span className="absolute inset-[-66.67%_-75%_-83.33%_-75%]">
          <img src={ICON.hourglass} alt="" className="block size-full max-w-none" />
        </span>
      </span>

      <div className="absolute left-[88px] top-1/2 flex w-[545px] -translate-y-1/2 flex-col gap-[4px]">
        <p className="text-[24px] font-bold leading-[32px] tracking-[-0.25px] text-default-text-base">
          Your next campaign
        </p>
        <p className="text-[16px] text-default-text-medium">
          You’ll be able to launch a new campaign on approximately{' '}
          <span className="font-semibold text-default-text-base">{unlockDate}</span>
        </p>
      </div>

      <div className="absolute right-0 top-1/2 flex w-[254px] -translate-y-1/2 flex-col items-center gap-[8px]">
        <p className="text-[16px] font-medium text-default-text-medium">Unlocks in</p>
        <p className="text-[32px] font-extrabold leading-[32px] tracking-[-0.25px] text-default-text-base">
          {unlockInDays} Days
        </p>
      </div>
    </section>
  )
}
