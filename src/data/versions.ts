export type VersionId = 'v1' | 'v2'

export interface Version {
  id: VersionId
  name: string
  caption: string
  /** What actually differs, shown in the switcher so the comparison is explicit. */
  detail: string
}

export const VERSIONS: Version[] = [
  {
    id: 'v1',
    name: 'V1',
    caption: 'Proportional funnel',
    detail: 'Segment widths track headcount. Stage names live in the chip row below.',
  },
  {
    id: 'v2',
    name: 'V2',
    caption: 'Stage rail',
    detail: 'Equal columns with the stage name and a hint underneath. No chip row.',
  },
]
