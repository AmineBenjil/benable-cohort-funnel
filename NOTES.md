# Build notes — Benable campaign dashboard prototype

Two versions of the cohort bar ship side by side, switchable from the floating
prototype control in the bottom-right corner:

| | Source | Shape |
|---|---|---|
| **V1** | [`11603:48887`](https://www.figma.com/design/8rB3KQsQhmJrnQk3EFkcDx/Design-Labs?node-id=11603-48887) | Proportional funnel + chip row |
| **V2** | [`11638:138810`](https://www.figma.com/design/8rB3KQsQhmJrnQk3EFkcDx/Design-Labs?node-id=11638-138810) | Equal-width stage rail, labels underneath, no chips |

Everything else — sidebar, header, creators card, right rail, the twelve states,
and the derived numbers — is shared, so the two versions differ only in the bar.
V2 notes are in §7; §1–6 describe V1 and the shared shell.

Design source: [Design Labs → `11603:48887` "State 1: Campaign Beginning"](https://www.figma.com/design/8rB3KQsQhmJrnQk3EFkcDx/Design-Labs?node-id=11603-48887) (1512 × 1376).

The Figma MCP was connected, so **every value below came from `get_design_context` /
`get_metadata` on the real nodes**, not from the written brief. Where the brief and the
frame disagreed, the frame won — the differences are listed at the bottom.

Sibling frames: I checked the frame's subtree and found no other "State N" frames next to
this one. Only "State 1" exists, so the other eleven states in §8 are my own compositions
built on the same primitives.

---

## 1. Taken verbatim from Figma

### Tokens (Figma variables, surfaced as CSS vars in `src/index.css`)

| Variable | Value |
|---|---|
| `default/default-bg-body` | `#ffffff` |
| `default/default-border-base` | `#e3e3e3` |
| `default/default-border-strong` | `#1c1c1c` |
| `default/default-text-base` | `#1c1c1c` |
| `default/default-text-medium` | `#717171` |
| `accent/accent-bg-light` | `#f5f3fc` |
| `accent/accent-text`, `button-link/btn-link-active` | `#7a5cfa` |
| `radius/md` | `12px` |
| `spacing/sp-8`, `spacing/sp-12` | `8px`, `12px` |

### Raw node values

- Canvas `#f9fafb`; header hairline `#e8e8e8`; column-header strip `#fafafa`.
- Cards: `16px` radius, `1px #e3e3e3`, `shadow 0 4px 8px rgba(0,0,0,0.03)`. Card header `64px`.
- Sidebar `296 × 1405`, `0.5px #e3e3e3` right border. Logo block `180 × 47.225` at `(12, 31.906)`;
  tile `41.559²` radius `9.542`; glyph `21.202 × 27.352`; wordmark `93.737 × 19.102` at `x 53.559`.
- Nav items `272 × 48`, radius `12`, icon `24`, gap `16`, label `16px/500`. Active fill `#f5f3fc`,
  label `#7a5cfa`. "Coming soon" pill `#f7f7f7`, `10px/500`, `lh 16.5`, `tracking -0.1355`.
- Header `1216 × 165` at `x 296`. Breadcrumb at `(32, 32)`; title row at `y 68`; tabs at `y 124`.
- Title `18px/700 #222`, `lh 21.6`, `tracking 0.07`. Status pill `#ebf7ff` / dot + text `#0c8ee9`,
  `12px/500`, `pl 8 / pr 12`, gap `6`. Brief button `191.445 × 40`, radius `12`, border `#ececec`,
  label `14px/500 #1a1a1a`.
- Tabs `16px/600`, `lh 19.2`; active `#111` with a `2px #111` underline; inactive `#717171`.
  The `8px` red dot exports at 34px because of its shadow — the circle sits at `(13, 12)` inside it,
  which is why it is offset `-21px / -12px`.
- Progress region `1156 × 194` at `(328, 189)`, `flex-col gap 16`.
- Stat row `48` tall: `40px/700 #267852` + `14px/400 #267852`, baseline-aligned. Note `13px`, gap `6`.
- **Bar**: `36` tall, `flex`, **`3px` gap**. Outer corners `100px`, interior `6px`. Count `13px/600`.
- **Exited segment**: fill `#ebedeb`, stripes `rgba(214,219,214,0.5)` — `1.794px` wide, `13.64px`
  apart on x, each rotated `-36.24deg`. Reproduced as a `repeating-linear-gradient` at `53.76deg`
  (= 90 − 36.24) with an `11px` perpendicular period (= 13.64 · sin 53.76°). Count `13px/600 #808080`.
- **Attention badge** (node `11633:138219`): `#e0900f`, `1.5px` white border, radius `99`, `px 6`,
  `h 14`, `10px/800` white, `tracking 0.0923`, `drop-shadow 0 1px 2px rgba(180,83,9,0.28)`.
  Pinned at `top -7 / right 1` of its segment — exactly where the frame places it.
- Chips: `33` tall, radius `8`, `px 12 / py 8`, gap `12` between label-group and count, `4` between
  dot and label. Dot `12`. Label `14px/600 #1c1c1c`, count `14px/600 #717171`.
  Selected = `#1c1c1c` border + `drop-shadow 0 2px 1.5px rgba(0,0,0,0.04)`.
- Creators card `766` wide. Column headers at `x 20 / 262 / 593`, `y 12`, `12px/600 #717171`, strip `39` tall.
  Rows `64` tall; avatar `36` at `(20, 14)`; name `14px/500 #18181b`; check `16`; handle `12px/400 #71717a`;
  update at `(262, 22.5)` `14px`; stage dashes at `(593, 30)`, each `12 × 4`, radius `2`, gap `4`,
  filled `#7a5cfa` / empty `#e3e3e3`; chevron at `x 734`. Footer link at `(24, 503)`, `16px/600 #7a5cfa`.
- Right rail `370` wide, cards `320 / 214 / 243`, gaps `20`. Note rows `py 16`, emoji `16px`,
  text `14px/20px` — bold clause `#1c1c1c`, remainder `#717171`.
- Pace meters `330 × 11`, track `#f7f7f7` with a `0.5px #e3e3e3` border, radius `12`, fill inset `1px`;
  mine `#815aff`, industry `#c4c4c4`. Footer strip `330 × 37`, radius `12`, border `0.5px #e8e4ef`,
  background image + `linear-gradient(176.187deg, #fff 22.804%, rgba(255,255,255,0.8) 95.775%)`,
  text `13px #696969` with `#1c1c1c` bold tail.

### Assets

Every icon, avatar and brand mark is **exported from Figma and committed** under
`src/assets/{icons,brand,avatars}`. Nothing is hand-drawn and no icon library is used, so the
glyphs are byte-identical to the frame: `nav-campaigns`, `nav-push-alerts`,
`nav-brand-intelligence`, `nav-ugc`, `chevron` (one export, rotated 0/90/180/270 the way the frame
does), `eye`, `group`, `invites`, `insight`, `plus`, `check-circle`, `tab-dot`, `dot-all`,
`logo-tile.png`, `logo-glyph.svg`, `wordmark.svg`, `pace-strip.png`, and the six `avatar/persona` renders.

---

## 2. Approximated or extrapolated

| Thing | What Figma had | What I did |
|---|---|---|
| **Stage ramp** | Only 4 of 7 fills placed (`#b2e0c7`, `#7ac299`, `#4da673`, `#298c5c`) plus `#d8efe2` as a chip dot | Used Figma's `#d8efe2 → #b2e0c7 → #7ac299 → #4da673` for stages 1–4 exactly, then `#1f7a50 / #14603d / #0d4830` for 5–7. See the contrast note below for why stage 5 is not `#298c5c`. |
| **Segment widths** | Hard-coded `84 / 150 / 84 / 84`, i.e. compressed proportionality | `flex-grow: count` with a `44px` `flex-basis` floor, which reproduces that compression from real data. |
| **Zero-stage sliver** | Not present in the frame | `14px` hatched sliver (tighter hatch than the exit block so it reads at that width). |
| **Exit separation** | Exit block sits in the same 3px flex gap | `20px` of separation (3 + 14 + 3) with a `1px` dashed `#d4d8d4` rule, per the brief. |
| **Tooltip** | Not in the frame | Own design: `#1c1c1c`, radius 10, `13px` title / `12px` body, clamped so it never leaves the bar. |
| **Pace meter fills** | Fixed `238px` and `79px` | Derived: mine = `dayOfPlan / planLength`, industry = `planLength / industryAverageDays`. Keeps Figma's shape (yours longer, industry shorter) while staying honest across scenarios. |
| **Right-rail copy** | Literal strings | Derived from `creators` where the number is computable (confirmed / shipped / exits / flags), so it doesn't lie in the other eleven states. Dates ("Friday 08", "Thursday") stay literal — there is no date field in the model. |
| **Rail card heights** | Fixed `320 / 214 / 243` | Content-sized, so a scenario with fewer rows doesn't leave a gap. Widths and paddings are unchanged. |
| **Scenario switcher** | Not in the frame | Dev-only strip above the page. |

---

## 3. Issues found in the frame

### Contrast on the light segments — **fixed, needs a designer decision**

In the frame **every** count is white, including on `#b2e0c7` (≈1.7:1) and `#7ac299` (≈2.1:1).
Both fail WCAG AA badly. I put a dark green (`#06301f`) on the four lightest fills and white on
the three darkest, so every count clears 4.5:1.

That fix alone still left one hole: `#298c5c` sits in a dead zone where *neither* white (4.19:1)
nor dark green (3.56:1) passes. So stage 5 uses `#1f7a50` instead — one notch darker, same hue
family, white text at 5.3:1. It is the only ramp value I moved, and it was a placeholder colour
in a frame that only defines four of the seven stages anyway. **If the designer wants `#298c5c`
kept, the count on that segment has to grow to 18.66px bold to qualify as large text.**

### Duplicate chip

The chip row shows **"Content published" twice** (nodes `11618:55520` and `11618:55525`) and omits
**"Draft submitted"**. Treated as a copy/paste slip; the seven stages from §2.1 of the brief are used.

### Six dashes for seven stages

The stage indicator in every creator row draws **6** dashes (`11606:49496`…`11606:49881`) while the
funnel has **7** stages. I render **7**, which widens the indicator from 92px to 108px — still clear
of the chevron at `x 734`. Flagging for confirmation.

### Placeholder numbers

The frame's solid segments sum to `1+4+1+1 = 7`, the striped block reads `6`, and the chips total
`10`. None of these agree. Treated as placeholder values; everything in the app is derived.

---

## 4. The striped block — which reading I built

**I built (a) Exited.** The layer is literally named "Exited Segment", and it is the only thing a
stage-count bar cannot express on its own — (b) "not yet reached" is just `cohortSize` minus the
sum of the stages, so it needs no dedicated block.

Concretely: `exit?: ExitReason` on a creator means they left and can never advance
(`declined` · `expired` · `dropped` · `undeliverable`). They stay in the cohort headcount, they are
excluded from both the numerator and denominator of the completion percentage, they render muted
in the list with the exit reason as their update text, and the block is filterable like any other
segment. Its tooltip breaks the count down by reason rather than listing names.

**This is the one thing worth confirming with the designer before this goes further.** If the block
was meant as (b), the model change is small — drop `exit` and derive the block from
`cohortSize − Σ stageCounts` — but the completion maths and the muted list rows would come out.

---

## 5. Two judgement calls worth a second opinion

**Single-creator campaigns.** State 9 renders one creator filling the whole bar. It is
proportionally honest and it looks wrong — a full-width bar that says "1" reads like a progress
bar at 100%, not a cohort at stage 4. My recommendation: below ~3 creators, drop the bar and show
the stage chips plus the list. I left the bar in so you can see the problem.

**Zero-stage slivers vs. the funnel shape.** At 14px a hatched sliver holds the gap in the shape
but can't carry a label. In "Gaps in the funnel" that reads fine because the chips carry the
zeroes. In a 20-stage funnel it wouldn't.

---

## 7. V2 — the stage rail (`11638:139353`)

### Taken verbatim

- Rail `1156` wide at `(328, 253)`, `flex`, **`4px` gap**, `items-start`.
- Columns are `flex: 1 0 0` — **equal width regardless of headcount** (the frame's
  "3" column is exactly as wide as its "2" columns). At 1156px that is 141px each,
  which the build reproduces exactly. This is the real difference from V1: V1
  encodes headcount in width, V2 encodes it only in the number.
- Bar block `40` tall. Outer corners `74` left / `100` right, interior `4`.
- Count `13px/700`, `lh 16.9`, `tracking -0.0762`.
- Label `12.5px/600`, `lh 16.25`, `tracking -0.0366`, `#1a1a1a`.
- Hint `11.5px/400`, `lh 16.1`, `tracking 0.0337`, `#9a9a9a`. Both sit in a block
  inset `8px` from the left of the column.
- Attention badge identical to V1's, pinned `-7px / 3px` — the frame places it at
  `(590, 246)`, which is the top-right of the second column.
- Hint copy verbatim: "invites go out on approval", "placing orders now",
  "shipments in transit", "once packages land", "after filming", "after our
  checks", "after posts go live". The ones the frame writes with a number are
  derived from live counts; the rest are static.

### Changed or added

| Thing | Frame | Build |
|---|---|---|
| **"Casting…" column** | An eighth, leading column (`#dbeee3`, "1 being cast now") | **Not drawn.** It is a pre-invite stage the shared data model has no state for, and V1/V2 must render the same cohort to be comparable. Adding it would mean either an eighth stage in V1 too (which V1's frame doesn't have) or two different funnels. Worth confirming: is Casting a real stage, or shorthand for "shortlist not yet approved"? |
| **Exited column** | Absent | Added as a trailing hatched column with the same `Exited` label and a count hint, so the drop-off states stay meaningful in V2. |
| **Empty stage** | All columns have counts | Hatched fill, muted `0`. Equal widths mean the label still reads — arguably V2's best moment versus V1's 14px slivers. |
| **Chip row** | Absent | Kept absent. The labels under each column do the chips' job. |
| **"Needs you" filter** | No entry point | The amber badge is a button — clicking it filters across all stages, exactly as V1's "Needs you" chip does. Nothing is added to the design; the existing badge just became interactive. |
| **Label block height** | Free-flowing | Fixed at `49px` (title + two hint lines) so columns stay level whether or not a hint wraps, and the skeleton matches without layout shift. |

### Contrast — same problem, same fix

The frame puts **white** on `#5fb98c` (2.41:1) and `#30aa70` (2.95:1), both well
under AA. Those two now take the same dark green (`#06301f`) V1 uses, giving
6.19:1 and 5.06:1. `#1c9c65` (Draft submitted) sits in the same dead zone V1's
`#298c5c` did — white 3.52:1, dark ink 4.25:1, neither passes — so it moved one
notch darker to `#17864f`, where white clears 4.66:1. Ramp order is unchanged.

The frame's own dark ink `#16462e` is used on the two lightest fills and passes
there (7.4:1, 5.9:1), but fails on `#5fb98c`; the build unifies on `#06301f` so
one ink covers every light fill in both versions.

## 8. The prototype control

The top scenario strip is gone. In its place is a floating pill in the
bottom-right that reads `V1 · Mid-campaign` when closed — the current version and
state at a glance — and opens into a panel with the version switch on top and the
twelve states beneath. `Esc` closes the panel first and only clears the funnel
filter on a second press, so the two never fight.

## 9. Where the derivations live

`useCampaignFunnel(campaign)` is the single source for stage counts, cohort size, completion
percent, cumulative reach, flag counts and exit breakdown. The bar, the chips, the stat row and
the list all read from that one hook, so they cannot disagree. Nothing derived is stored on the
fixture — change one creator's `stage` in `src/data/fixtures.ts` and all four update together.
