import { Chevron, ICON } from './icons'

export function TopBar({
  title,
  status,
  onBack,
}: {
  title: string
  status: 'active' | 'draft' | 'wrapped'
  onBack?: () => void
}) {
  const statusLabel = { active: 'Active', draft: 'Draft', wrapped: 'Wrapped' }[status]

  return (
    <header className="h-[165px] shrink-0 border-b border-hairline bg-white">
      <div className="mx-auto h-full w-full max-w-[1216px] pl-[32px] pr-[28px]">
        {/* Breadcrumb — 20px tall block at y=32 */}
        <button
          type="button"
          onClick={onBack}
          className="mt-[32px] flex h-[20px] w-fit items-center gap-[8px]"
        >
          <Chevron dir="left" />
          <span className="text-[14px] tracking-[-0.15px] text-default-text-medium">Campaigns</span>
        </button>

        {/* Title row — 40px tall block at y=68 */}
        <div className="mt-[16px] flex h-[40px] items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <h1 className="text-[18px] font-bold leading-[21.6px] tracking-[0.07px] text-ink-700">
              {title}
            </h1>
            <span className="flex h-[20px] items-center gap-[6px] rounded-full bg-info-bg pl-[8px] pr-[12px]">
              <span className="size-[6px] shrink-0 rounded-full bg-info" aria-hidden />
              <span className="text-[12px] font-medium leading-[12px] text-info">{statusLabel}</span>
            </span>
          </div>
          <button
            type="button"
            className="flex h-[40px] w-[191.445px] items-center justify-center gap-[8px] rounded-[12px] border border-[#ececec] bg-white px-[25px] py-px transition-colors hover:bg-[#fafafa]"
          >
            <span className="relative block size-[16px] shrink-0 overflow-hidden">
              <img
                src={ICON.eye}
                alt=""
                className="absolute left-[1.336px] top-[3.29px] block h-[9.427px] w-[13.331px] max-w-none"
              />
            </span>
            <span className="text-[14px] font-medium text-ink-600">Campaign Brief</span>
          </button>
        </div>

        {/* Tabs — 41px block at y=124, hairline flush with the header edge */}
        <div className="mt-[16px] flex h-[41px] items-end">
          <div className="flex flex-1 items-end gap-[8px] border-b border-hairline pb-px">
            <button
              type="button"
              aria-current="page"
              className="h-[40px] shrink-0 border-b-2 border-ink-900 px-[8px] text-[16px] font-semibold leading-[19.2px] text-ink-900"
            >
              Dashboard
            </button>
            <button
              type="button"
              className="relative h-[40px] shrink-0 border-b-2 border-transparent px-[8px] text-[16px] font-semibold leading-[19.2px] text-default-text-medium transition-colors hover:text-ink-900"
            >
              Content
              {/* 8px dot exported at 34px because of its drop shadow; the
                  circle sits at (13,12) inside that box. */}
              <img
                src={ICON.tabDot}
                alt=""
                className="pointer-events-none absolute -right-[21px] -top-[12px] block size-[34px] max-w-none"
              />
              <span className="sr-only">(unread)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
