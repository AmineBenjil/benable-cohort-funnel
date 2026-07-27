/**
 * Skeletons mirror the loaded geometry exactly — 48px stat row, 36px bar,
 * two 33px chip rows, 64px table rows — so nothing shifts when data lands.
 */

export function ProgressSkeleton({ version = 'v1' }: { version?: 'v1' | 'v2' }) {
  return (
    <div className="flex flex-col gap-[16px]" aria-busy="true" aria-label="Loading campaign progress">
      <div className="flex h-[48px] items-end justify-between">
        <div className="flex items-baseline gap-[8px]">
          <span className="shimmer block h-[40px] w-[112px] rounded-[8px]" />
          <span className="shimmer block h-[14px] w-[56px] rounded-[4px]" />
        </div>
        <span className="shimmer block h-[16px] w-[452px] rounded-[4px]" />
      </div>

      {version === 'v2' ? <RailSkeletonRow /> : <FunnelSkeletonRow />}
    </div>
  )
}

/** V1: 36px proportional bar + two wrapped chip rows. */
function FunnelSkeletonRow() {
  return (
    <>
      <div className="flex h-[36px] w-full gap-[3px]">
        {[10, 22, 12, 12, 8, 8, 6, 22].map((grow, i, all) => (
          <span
            key={i}
            className="shimmer h-full min-w-0"
            style={{
              flexGrow: grow,
              flexBasis: 44,
              borderTopLeftRadius: i === 0 ? 100 : 6,
              borderBottomLeftRadius: i === 0 ? 100 : 6,
              borderTopRightRadius: i === all.length - 1 ? 100 : 6,
              borderBottomRightRadius: i === all.length - 1 ? 100 : 6,
            }}
          />
        ))}
      </div>

      {/* Same widths as the real chips so they wrap onto the same two rows. */}
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-wrap content-center items-center gap-[12px]">
          {[147, 106, 125, 148, 163, 165, 184, 119].map((w, i) => (
            <span key={i} className="shimmer block h-[33px] rounded-[8px]" style={{ width: w }} />
          ))}
        </div>
        <div className="flex gap-[12px]">
          {[135, 105].map((w, i) => (
            <span key={i} className="shimmer block h-[33px] rounded-[8px]" style={{ width: w }} />
          ))}
        </div>
      </div>
    </>
  )
}

/** V2: eight equal 40px columns, each with a fixed 49px label block. */
function RailSkeletonRow() {
  return (
    <div className="flex w-full items-start justify-center gap-[4px]">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col gap-[8px]">
          <span
            className="shimmer block h-[40px] w-full"
            style={{
              borderTopLeftRadius: i === 0 ? 74 : 4,
              borderBottomLeftRadius: i === 0 ? 74 : 4,
              borderTopRightRadius: i === 7 ? 100 : 4,
              borderBottomRightRadius: i === 7 ? 100 : 4,
            }}
          />
          <div className="flex h-[49px] flex-col gap-[6px] pl-[8px] pr-[7px] pt-[3px]">
            <span className="shimmer block h-[10px] w-[72%] rounded-[3px]" />
            <span className="shimmer block h-[9px] w-[90%] rounded-[3px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CreatorTableSkeleton() {
  return (
    <section
      className="w-[766px] shrink-0 overflow-hidden rounded-[16px] border border-default-border-base bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.03)]"
      aria-busy="true"
      aria-label="Loading creators"
    >
      <div className="flex h-[64px] items-center gap-[12px] border-b border-default-border-base px-[20px]">
        <span className="shimmer block size-[32px] rounded-[8px]" />
        <span className="flex flex-col gap-[4px]">
          <span className="shimmer block h-[14px] w-[64px] rounded-[4px]" />
          <span className="shimmer block h-[12px] w-[58px] rounded-[4px]" />
        </span>
      </div>
      <div className="h-[39px] border-b border-default-border-base bg-[#fafafa]" />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="relative h-[64px] border-b border-default-border-base">
          <span className="shimmer absolute left-[20px] top-[14px] block size-[36px] rounded-full" />
          <span className="shimmer absolute left-[64px] top-[17px] block h-[14px] w-[110px] rounded-[4px]" />
          <span className="shimmer absolute left-[64px] top-[37px] block h-[12px] w-[86px] rounded-[4px]" />
          <span className="shimmer absolute left-[262px] top-[23px] block h-[14px] w-[168px] rounded-[4px]" />
          <span className="shimmer absolute left-[593px] top-[30px] block h-[4px] w-[108px] rounded-[2px]" />
        </div>
      ))}
      <div className="pb-[21px] pl-[24px] pt-[16px]">
        <span className="shimmer block h-[24px] w-[140px] rounded-[6px]" />
      </div>
    </section>
  )
}

export function RailSkeleton() {
  return (
    <div className="flex w-[370px] shrink-0 flex-col gap-[20px]" aria-hidden>
      {[320, 214, 243].map((h) => (
        <div
          key={h}
          className="w-full overflow-hidden rounded-[16px] border border-default-border-base bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.03)]"
          style={{ height: h }}
        >
          <div className="flex h-[64px] items-center gap-[12px] border-b border-default-border-base px-[20px]">
            <span className="shimmer block size-[32px] rounded-[8px]" />
            <span className="shimmer block h-[14px] w-[132px] rounded-[4px]" />
          </div>
          <div className="flex flex-col gap-[18px] px-[20px] pt-[24px]">
            <span className="shimmer block h-[14px] w-full rounded-[4px]" />
            <span className="shimmer block h-[14px] w-[74%] rounded-[4px]" />
            <span className="shimmer block h-[14px] w-[88%] rounded-[4px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
