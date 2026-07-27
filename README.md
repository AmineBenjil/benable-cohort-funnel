# Benable — campaign detail dashboard (prototype)

Front-end prototype of the Benable campaign detail dashboard, built from Figma frame
`11603:48887` ("State 1: Campaign Beginning"). The centrepiece is the **cohort funnel bar**:
one horizontal bar showing where every creator in the campaign currently sits.

```bash
npm install && npm run dev
```

React 19 + TypeScript + Vite + Tailwind v4. No component library — the primitives are built here.
Single route, no router. All data comes from local fixtures.

## What to look at

A floating **prototype control** sits in the bottom-right. Closed it reads
`V1 · Mid-campaign`; open it switches both:

- **Version** — **V1** (proportional funnel + chip row, Figma `11603:48887`) or
  **V2** (equal-width stage rail with labels underneath, Figma `11638:138810`).
  Everything outside the bar is identical, so the two are directly comparable.
- **State** — loading, no creators, just launched, mid-campaign, gaps in the funnel,
  heavy drop-off, everyone exited, all wrapped, single creator, 48 creators,
  filtered-to-empty, and error. Each works in both versions.

## Structure

```
src/
  components/
    CohortFunnelBar.tsx   V1 bar — proportional segments, exit block, flag badges
    StageRailBar.tsx      V2 bar — equal columns, stage label + hint underneath
    segmentTooltip.tsx    portalled tooltip shared by both bars
    StageChips.tsx        V1 filter chips (all / per stage / needs you / exited)
    CreatorTable.tsx      766px creators card, expandable rows, empty states
    SidePanelCard.tsx     shell + note row shared by the right-rail cards
    RightRail.tsx         while you were away · up next · the pace
    PrototypeFab.tsx      floating version + state switcher (dev only)
    StatRow.tsx  TopBar.tsx  Sidebar.tsx  Skeletons.tsx
    icons.tsx             Figma-exported SVGs, sized wrappers
  data/
    types.ts              Creator / Campaign / StageId / stage metadata
    stageRail.ts          V2 ramp and hint copy
    versions.ts           V1 / V2 metadata
    fixtures.ts           all twelve scenarios
  hooks/
    useCampaignFunnel.ts  every derived number, in one place
  assets/{icons,brand,avatars}   exported from Figma, committed
```

## Data contract

`Campaign.creators` is the only stored state. Stage counts, cohort size, completion percent,
cumulative reach, flag counts and exit counts are all derived in `useCampaignFunnel` — change one
creator's `stage` and the bar, chips, stat row and list move together.

```ts
interface Creator {
  id: string
  name: string
  handle: string
  avatarUrl: string
  verified: boolean
  stage: StageId        // furthest stage reached
  latestUpdate: string
  flag?: FlagKind       // blocked at `stage` — not a stage itself
  exit?: ExitReason     // left the funnel; excluded from completion
}
```

Completion is `round(Σ stageIndex(non-exited) / (nonExitedCount × 6) × 100)`.

## Interaction

One selection at a time. A filter can be cleared four ways: re-click the segment or chip,
**All creators**, the **Show all** pill in the card header, or `Esc`. `←` / `→` move focus
across bar segments and skip empty ones. Segment tooltips are reachable on keyboard focus,
not hover only. All motion collapses under `prefers-reduced-motion`.

V2 has no chip row, so its amber flag badge is clickable and does what V1's **Needs you**
chip does. `Esc` closes the prototype control first, and only clears the filter on a
second press.

## Open questions

See [NOTES.md](NOTES.md) — in particular which reading of the striped "Exited" block is intended,
the contrast fix on the light segments (which V2's ramp needs too), the duplicated
"Content published" chip, the 6-dashes-vs-7-stages mismatch, and whether V2's leading
"Casting…" column is a real stage.
