import paceStrip from '../assets/brand/pace-strip.jpg'
import type { Campaign } from '../data/types'
import { STAGE_INDEX } from '../data/types'
import type { Funnel } from '../hooks/useCampaignFunnel'
import { ICON } from './icons'
import { NoteRow, SidePanelCard } from './SidePanelCard'

export function RightRail({ campaign, funnel }: { campaign: Campaign; funnel: Funnel }) {
  return (
    <div className="flex w-[370px] shrink-0 flex-col gap-[20px]">
      <SidePanelCard
        icon={ICON.invites}
        title="While you were away"
        subtitle={
          <>
            Since, <span className="font-semibold">Friday 08</span>
          </>
        }
      >
        <AwayRows funnel={funnel} />
      </SidePanelCard>

      <SidePanelCard icon={ICON.invites} title="Up next">
        <UpNextRows funnel={funnel} campaign={campaign} />
      </SidePanelCard>

      <PaceCard campaign={campaign} />
    </div>
  )
}

function AwayRows({ funnel }: { funnel: Funnel }) {
  const atLeast = (stage: keyof typeof STAGE_INDEX) =>
    funnel.active.filter((c) => STAGE_INDEX[c.stage] >= STAGE_INDEX[stage]).length

  const confirmed = atLeast('accepted')
  const shipped = atLeast('orderPlaced')
  const delivered = atLeast('orderReceived')

  const rows: { emoji: string; strong: string; rest?: string }[] = []

  if (confirmed > 0) {
    rows.push({
      emoji: '✅',
      strong: `${confirmed} of ${funnel.activeCount} ${plural(funnel.activeCount, 'creator')} confirmed and`,
      rest: ' ready to go',
    })
  }
  if (shipped > 0) {
    rows.push({
      emoji: '📦',
      strong: `${shipped} ${plural(shipped, 'package')} shipped `,
      rest: delivered > 0 ? '— first one already delivered' : '— none delivered yet',
    })
  }
  if (funnel.exitedCount > 0) {
    rows.push({
      emoji: '🔁',
      strong: `${funnel.exitedCount} ${plural(funnel.exitedCount, 'stand-in')} vetted `,
      rest: funnel.exitedCount === 1 ? 'to replace the creator who dropped' : 'to replace the creators who dropped',
    })
  }
  if (funnel.flaggedCount > 0) {
    rows.push({
      emoji: '👋',
      strong: `${funnel.flaggedCount} ${funnel.flaggedCount === 1 ? 'thing needs' : 'things need'} you `,
      rest: '— everything else is handled',
    })
  } else if (funnel.activeCount > 0) {
    rows.push({ emoji: '👋', strong: '2 delivery nudges sent ', rest: '— nothing needed your input' })
  }

  if (rows.length === 0) {
    rows.push({
      emoji: '🌱',
      strong: 'Nothing has happened yet ',
      rest: '— we’ll fill this in once creators start moving',
    })
  }

  return (
    <>
      {rows.map((row, i) => (
        <NoteRow key={row.emoji + row.strong} {...row} tight={i === 0} last={i === rows.length - 1} />
      ))}
    </>
  )
}

function UpNextRows({ funnel, campaign }: { funnel: Funnel; campaign: Campaign }) {
  const daysLeft = Math.max(0, campaign.planLength - campaign.dayOfPlan)
  const next = funnel.active.find((c) => STAGE_INDEX[c.stage] < STAGE_INDEX.contentPublished)
  const nothingLeft = funnel.activeCount === 0

  return (
    <>
      <NoteRow
        emoji="⏰"
        tight
        strong={
          next
            ? `${next.name.split(' ')[0]}’s post goes live`
            : nothingLeft
              ? 'Nobody is moving right now'
              : 'Nothing is waiting on a creator'
        }
        rest={
          next ? ' — Thursday' : nothingLeft ? ' — invite someone to restart the funnel' : ' — every post is already live'
        }
      />
      <NoteRow
        emoji="🏁"
        last
        strong="Campaign wrap + your content library "
        rest={daysLeft > 0 ? `— in ${daysLeft} days` : '— ready now'}
      />
    </>
  )
}

function PaceCard({ campaign }: { campaign: Campaign }) {
  const mine = clamp(campaign.dayOfPlan / Math.max(1, campaign.planLength))
  const industry = clamp(campaign.planLength / Math.max(1, campaign.industryAverageDays))

  return (
    <section className="w-full overflow-hidden rounded-[16px] border border-default-border-base bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.03)]">
      <div className="flex h-[64px] items-center border-b border-default-border-base px-[20px]">
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-accent-bg-light">
            <img src={ICON.insight} alt="" className="block h-[11.728px] w-[13.999px] max-w-none" />
          </span>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[14px] font-bold text-black">The pace</p>
            <p className="text-[12px] text-default-text-medium">
              Day {campaign.dayOfPlan} out of {campaign.planLength}
            </p>
          </div>
        </div>
      </div>

      <div className="px-[20px] pb-[20px] pt-[13px]">
        <Meter label="Your campaign" trailing={`Day ${campaign.dayOfPlan}`} pct={mine} fill="var(--color-pace-mine)" />
        <div className="h-[10px]" />
        <Meter label="Industry average" pct={industry} fill="var(--color-pace-industry)" />

        <div className="relative mt-[13px] flex h-[37px] items-center justify-center overflow-hidden rounded-[12px] border-[0.5px] border-[#e8e4ef]">
          <span aria-hidden className="absolute inset-0 overflow-hidden rounded-[12px]">
            <img
              src={paceStrip}
              alt=""
              className="absolute left-[-6.24%] top-[-29.84%] block h-[138.28%] w-[112.49%] max-w-none"
            />
            <span
              className="absolute inset-0 block rounded-[12px]"
              style={{
                backgroundImage:
                  'linear-gradient(176.187deg, rgb(255,255,255) 22.804%, rgba(255,255,255,0.8) 95.775%)',
              }}
            />
          </span>
          <p className="relative text-[13px] text-[#696969]">
            Wrapped in {campaign.planLength} days,{' '}
            <span className="font-semibold text-default-text-base">
              Industry average: {campaign.industryAverageDays} days.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

function Meter({
  label,
  trailing,
  pct,
  fill,
}: {
  label: string
  trailing?: string
  pct: number
  fill: string
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-semibold text-default-text-base">{label}</span>
        {trailing && <span className="text-default-text-medium">{trailing}</span>}
      </div>
      <div
        className="mt-[12px] h-[11px] w-full overflow-hidden rounded-[12px] border-[0.5px] border-default-border-base bg-progress-track"
        role="meter"
        aria-label={label}
        aria-valuenow={Math.round(pct * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="ml-px mt-px h-[9px] rounded-[12px] transition-[width] duration-500"
          style={{ width: `calc(${(pct * 100).toFixed(2)}% - 2px)`, background: fill }}
        />
      </div>
    </div>
  )
}

const clamp = (n: number) => Math.min(1, Math.max(0, n))
const plural = (n: number, word: string) => (n === 1 ? word : `${word}s`)
