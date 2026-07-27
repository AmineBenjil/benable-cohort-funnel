import type { Campaign, Creator, ExitReason, FlagKind, StageId } from './types'

import a1 from '../assets/avatars/1.jpg'
import a2 from '../assets/avatars/2.jpg'
import a3 from '../assets/avatars/3.jpg'
import a4 from '../assets/avatars/4.jpg'
import a5 from '../assets/avatars/5.jpg'
import a6 from '../assets/avatars/6.jpg'

/** Avatar renders exported from the Figma frame (avatar/persona instances). */
export const AVATARS = [a1, a2, a3, a4, a5, a6]

const NAMES = [
  ['Leia Butler', '@leiabutler'],
  ['Skylar Peterson', '@skylarpeterson'],
  ['Zoey Diaz', '@zoeydiaz'],
  ['Cassidy Nguyen', '@cassidywellness'],
  ['Harper Scott', '@harperscott'],
  ['Madison Taylor', '@madisontaylor'],
  ['Maya Okafor', '@mayaokafor'],
  ['Priya Raman', '@priyaraman'],
  ['Noa Feldman', '@noafeldman'],
  ['Ines Duarte', '@inesduarte'],
  ['Bea Lindqvist', '@bealindqvist'],
  ['Tomas Ricci', '@tomasricci'],
]

const UPDATES: Record<StageId, string> = {
  invited: 'Invite sent, waiting to hear back',
  accepted: 'Accepted — picking a shade',
  orderPlaced: 'Order placed, label printed',
  orderReceived: 'Cleared the Memphis hub',
  draftSubmitted: 'First draft in your review queue',
  contentPublished: 'Reel is live, 12k views so far',
  thanked: 'Thank-you note sent',
}

let seq = 0
interface Seed {
  stage: StageId
  flag?: FlagKind
  exit?: ExitReason
  update?: string
  verified?: boolean
}

function make({ stage, flag, exit, update, verified = true }: Seed): Creator {
  const i = seq++
  const [name, handle] = NAMES[i % NAMES.length]
  const suffix = i >= NAMES.length ? ` ${Math.floor(i / NAMES.length) + 1}` : ''
  return {
    id: `c${i}`,
    name: name + suffix,
    handle: handle + (suffix ? suffix.trim() : ''),
    avatarUrl: AVATARS[i % AVATARS.length],
    verified,
    stage,
    latestUpdate: update ?? UPDATES[stage],
    flag,
    exit,
  }
}

function campaign(over: Partial<Campaign>, creators: Creator[]): Campaign {
  seq = 0
  return {
    name: 'Pikora Instant Bone Broth Collection',
    status: 'active',
    dayOfPlan: 30,
    planLength: 30,
    industryAverageDays: 67,
    forecastNote: 'On track to wrap Aug 14, about 9 days ahead of a typical gifted campaign',
    creators,
    ...over,
  }
}

const build = (seeds: Seed[]) => {
  seq = 0
  return seeds.map(make)
}

export interface Scenario {
  id: string
  label: string
  /** 'loading' and 'error' short-circuit the page before any campaign renders. */
  status?: 'loading' | 'error'
  campaign: Campaign
  /** Pre-applied filter, used by the filtered-to-empty scenario. */
  initialSelection?: { kind: 'stage'; id: StageId }
}

const midCampaign = campaign(
  {},
  build([
    { stage: 'orderReceived', update: 'Cleared the Memphis hub' },
    { stage: 'draftSubmitted', flag: 'review' },
    { stage: 'contentPublished', update: 'Reel is live, 12k views so far' },
    { stage: 'accepted' },
    { stage: 'orderPlaced', flag: 'stalled' },
    { stage: 'thanked' },
    { stage: 'invited' },
    { stage: 'orderReceived' },
    { stage: 'accepted', exit: 'dropped' },
    { stage: 'invited', exit: 'declined' },
  ]),
)

export const SCENARIOS: Scenario[] = [
  {
    id: 'loading',
    label: 'Loading',
    status: 'loading',
    campaign: midCampaign,
  },
  {
    id: 'empty',
    label: 'No creators yet',
    campaign: campaign(
      {
        dayOfPlan: 0,
        forecastNote: 'Invites go out as soon as you approve the shortlist',
      },
      [],
    ),
  },
  {
    id: 'launched',
    label: 'Just launched',
    campaign: campaign(
      {
        dayOfPlan: 2,
        forecastNote: 'Six invites are out. Most creators reply within 48 hours.',
      },
      build([
        { stage: 'invited' },
        { stage: 'invited' },
        { stage: 'invited', flag: 'approval' },
        { stage: 'accepted', flag: 'approval' },
        { stage: 'accepted' },
        { stage: 'accepted', flag: 'approval' },
        { stage: 'invited' },
        { stage: 'invited' },
      ]),
    ),
  },
  { id: 'mid', label: 'Mid-campaign', campaign: midCampaign },
  {
    id: 'gaps',
    label: 'Gaps in the funnel',
    campaign: campaign(
      { dayOfPlan: 18, forecastNote: 'Three creators are between stages — nothing needs you yet' },
      build([
        { stage: 'invited' },
        { stage: 'invited' },
        { stage: 'orderPlaced' },
        { stage: 'orderPlaced', flag: 'stalled' },
        { stage: 'contentPublished' },
        { stage: 'thanked' },
        { stage: 'thanked' },
      ]),
    ),
  },
  {
    id: 'dropoff',
    label: 'Heavy drop-off',
    campaign: campaign(
      { dayOfPlan: 24, forecastNote: 'Four of eleven are still moving. Worth topping up the shortlist.' },
      build([
        { stage: 'invited', exit: 'declined' },
        { stage: 'invited', exit: 'declined' },
        { stage: 'invited', exit: 'expired' },
        { stage: 'invited', exit: 'expired' },
        { stage: 'accepted', exit: 'dropped' },
        { stage: 'orderPlaced', exit: 'undeliverable' },
        { stage: 'orderPlaced', exit: 'undeliverable' },
        { stage: 'accepted' },
        { stage: 'orderReceived' },
        { stage: 'draftSubmitted', flag: 'review' },
        { stage: 'contentPublished' },
      ]),
    ),
  },
  {
    id: 'allExited',
    label: 'Everyone exited',
    campaign: campaign(
      { dayOfPlan: 21, forecastNote: 'Nobody is left to move. Start a fresh shortlist when you are ready.' },
      build([
        { stage: 'invited', exit: 'declined' },
        { stage: 'invited', exit: 'expired' },
        { stage: 'accepted', exit: 'dropped' },
        { stage: 'orderPlaced', exit: 'undeliverable' },
        { stage: 'invited', exit: 'expired' },
      ]),
    ),
  },
  {
    id: 'wrapped',
    label: 'All wrapped (100%)',
    campaign: campaign(
      {
        status: 'wrapped',
        forecastNote: 'Every creator wrapped. Content is in your library.',
      },
      build([
        { stage: 'thanked' },
        { stage: 'thanked' },
        { stage: 'thanked' },
        { stage: 'thanked' },
        { stage: 'thanked' },
        { stage: 'thanked' },
      ]),
    ),
  },
  {
    id: 'single',
    label: 'Single creator',
    campaign: campaign(
      { dayOfPlan: 9, forecastNote: 'One creator, one package. Wraps as soon as the post is live.' },
      build([{ stage: 'orderReceived' }]),
    ),
  },
  {
    id: 'large',
    label: 'Large cohort (48)',
    campaign: campaign(
      { dayOfPlan: 26, forecastNote: 'Big cohort moving steadily — 12 posts already live' },
      build(
        Array.from({ length: 48 }, (_, i): Seed => {
          const stages: StageId[] = [
            'invited',
            'accepted',
            'orderPlaced',
            'orderReceived',
            'draftSubmitted',
            'contentPublished',
            'thanked',
          ]
          const stage = stages[i % 7]
          return {
            stage,
            flag: i % 11 === 3 ? 'review' : i % 17 === 5 ? 'stalled' : undefined,
            exit: i % 13 === 7 ? 'dropped' : undefined,
            verified: i % 4 !== 3,
          }
        }),
      ),
    ),
  },
  {
    id: 'filteredEmpty',
    label: 'Filtered to empty',
    campaign: campaign(
      { dayOfPlan: 12, forecastNote: 'Packages are still in transit — no drafts due yet' },
      build([
        { stage: 'invited' },
        { stage: 'accepted' },
        { stage: 'accepted' },
        { stage: 'orderPlaced' },
        { stage: 'orderReceived' },
      ]),
    ),
    initialSelection: { kind: 'stage', id: 'thanked' },
  },
  {
    id: 'error',
    label: 'Error',
    status: 'error',
    campaign: midCampaign,
  },
]

export const DEFAULT_SCENARIO = 'mid'
