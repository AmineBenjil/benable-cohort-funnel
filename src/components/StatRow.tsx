import type { Funnel } from '../hooks/useCampaignFunnel'

export function StatRow({ funnel, note }: { funnel: Funnel; note: string }) {
  const { completionPct, cohortSize, exitedCount } = funnel

  let headline = `${completionPct}%`
  let caption = 'through'

  if (cohortSize === 0) {
    headline = 'Not started'
    caption = 'no creators invited yet'
  } else if (completionPct === null && exitedCount > 0) {
    headline = 'Nobody left'
    caption = 'in the funnel'
  }

  const big = headline.length > 5

  return (
    <div className="flex h-[48px] w-full items-end justify-between">
      <div className="flex items-baseline gap-[8px] text-green-stat">
        <p className={`font-bold ${big ? 'text-[30px] leading-[48px]' : 'text-[40px] leading-[48px]'}`}>
          {headline}
        </p>
        <p className="text-[14px]">{caption}</p>
      </div>
      <div className="flex items-center gap-[6px] text-[13px]">
        <span aria-hidden>🚀</span>
        <p className="text-default-text-base">{note}</p>
      </div>
    </div>
  )
}
