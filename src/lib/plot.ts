/**
 * The plot: the seeds grown from one starter, as records.
 *
 * This file is the diagram's only input. The map draws these rows as tables,
 * and `/plot/<id>` renders the same row under the page's prose, so the picture,
 * the table and the page cannot disagree — they are the same object.
 *
 * What belongs here: the fields a reader compares across seeds — where it
 * lives, what its front door assumes, what it inherited, what it added, what it
 * ships back. What does not: argument. That is the page body, in Markdown.
 *
 * Two invariants are checked at import time, which means a violation fails
 * `npm run build` before the guard ever runs:
 *
 *   1. every record has a page at src/content/plot/<id>.md
 *   2. every page in that folder has a record
 *
 * A diagram that draws a seed the site cannot describe, or a page the diagram
 * cannot place, is the drift this repository exists to make impossible.
 */
import { PAGES } from './content'
import { SCALE } from './seeds'
import { PARENT } from './site'

export type Role = 'starter' | 'child'

/** A child's vendored copy of the parent's rules, with the version it was taken at. */
export type Vendors = {
  /** the `le.gume` commit the copy names in its `version:` line */
  version: string
  /** rule ids the child replaces on the record */
  overrides: string[]
}

export type PlotSeed = {
  /** route slug: /plot/<id> */
  id: string
  /** the entity name, as its own site writes it */
  entity: string
  /** one line: what the site is */
  title: string
  role: Role
  /** the readiness its front door assumes */
  rung: number
  /** the route a newcomer is meant to open first, on that site */
  front: string
  /** deployed origin, without a trailing slash; null when it is not published */
  live: string | null
  /** owner/name on GitHub */
  repo: string
  /** first commit in the child's own history — the day it stopped being a clone */
  since: string
  /** the seed it was grown from; null for the starter */
  inherits: string | null
  /** content sections it kept from the starter */
  keeps: string[]
  /** what it added that the starter does not have */
  adds: string[]
  /** isotopes it publishes, by pickle name */
  ships: string[]
  /** a vendored copy of the parent's rules.md, if it keeps one */
  vendors: Vendors | null
  /** the one-line reason it exists */
  note: string
  /** where its table sits on the map, in flow coordinates */
  at: { x: number; y: number }
}

export const PLOT: PlotSeed[] = [
  {
    id: 'le.gume',
    entity: 'le.gume',
    title: 'The starter: a documentation site that documents itself',
    role: 'starter',
    rung: 2,
    front: '/docs/quickstart',
    live: PARENT.origin,
    repo: 'james-gibson/le.gume',
    since: '2026-11-11',
    inherits: null,
    keeps: ['docs', 'seeds', 'factors', 'isotopes', 'guides', 'pitch', 'writing'],
    adds: ['the content model', 'the publish guard', 'rules.md, generated from the guard'],
    ships: ['cornichon', 'silverskin'],
    vendors: null,
    note: 'The seed every row below was grown from. Its sections are the vocabulary the children keep or drop.',
    at: { x: 450, y: 0 },
  },
  {
    id: 'le.go',
    entity: 'le.go',
    title: 'The 42i system, introduced through citations',
    role: 'child',
    rung: 1,
    front: '/docs/01-parable',
    live: 'https://james-gibson.github.io/le.go',
    repo: 'james-gibson/le.go',
    since: '2026-11-15',
    inherits: 'le.gume',
    keeps: ['docs', 'isotopes', 'seeds'],
    adds: [
      'a brick-set design language, with its own components',
      'three live routes: /philosophy, /projector, /draft',
      'citations as the worked domain',
    ],
    ships: ['silverskin'],
    vendors: null,
    note: 'An educational deploy of the seed: how a citation became a magic string, and how to snap it back into bricks.',
    at: { x: 0, y: 440 },
  },
  {
    id: 'le.gume-energy',
    entity: 'le.gume-energy',
    title: 'A non-identifying, local-time record of one home solar system',
    role: 'child',
    rung: 0,
    front: '/docs/overview',
    live: 'https://james-gibson.github.io/le.gume-energy',
    repo: 'james-gibson/le.gume-energy',
    since: '2026-11-13',
    inherits: 'le.gume',
    keeps: ['docs', 'guides', 'isotopes', 'pitch', 'seeds'],
    adds: [
      'a daily export, run by launchd',
      'chart, universe and intervention data as build scripts',
      'a freshness check for the record',
    ],
    ships: ['cornichon', 'silverskin'],
    vendors: { version: '748e35f', overrides: [] },
    note: 'Production, weather, utility usage and the events that explain the gaps — one household, measured, with nothing identifying it.',
    at: { x: 300, y: 440 },
  },
  {
    id: 'le.gume-shell',
    entity: 'le.gume-shell',
    title: 'A shell for the lab: what runs, where to start, what it costs',
    role: 'child',
    rung: 3,
    front: '/',
    live: 'https://james-gibson.github.io/le.gume-shell',
    repo: 'james-gibson/le.gume-shell',
    since: '2026-11-15',
    inherits: 'le.gume',
    keeps: ['docs', 'seeds', 'factors', 'isotopes', 'guides', 'pitch', 'writing'],
    adds: [
      'a lab-operator seed on the shelf',
      'the alarm, dashboard, proxy and tick as the four things that run',
      'a front door written for someone about to touch the machine',
    ],
    ships: ['cornichon', 'dill', 'gherkin', 'piccalilli', 'silverskin'],
    vendors: null,
    note: 'The same seed, a different question: not "what is this" but "what is running, and what happens if I stop it".',
    at: { x: 600, y: 440 },
  },
  {
    id: 'le.railhead',
    entity: 'le.railhead',
    title: 'A local-time record of an RL environment where a model plays OpenTTD',
    role: 'child',
    rung: 1,
    front: '/brief/what-railhead-is',
    live: 'https://james-gibson.github.io/le.railhead',
    repo: 'james-gibson/le.railhead',
    since: '2026-11-14',
    inherits: 'le.gume',
    keeps: ['brief', 'ops', 'research', 'arena', 'seeds', 'verify'],
    adds: [
      'rules.md vendored at build time, with a catch-up check in CI',
      'an override on the record: RULES-02, for three live routes',
      'a rotation record beside the rules copy',
    ],
    ships: [],
    vendors: { version: '29d863e', overrides: ['RULES-02'] },
    note: 'A record of somebody else’s environment, kept to the parent’s rules — and one rule behind them, on purpose, until the next catch-up.',
    at: { x: 900, y: 440 },
  },
]

export function getPlotSeed(id: string): PlotSeed | undefined {
  return PLOT.find((seed) => seed.id === id)
}

/** The children, in map order. */
export function children(): PlotSeed[] {
  return PLOT.filter((seed) => seed.role === 'child')
}

export function rungLabel(rung: number): string {
  return SCALE[rung]?.label ?? 'Unstated'
}

// --- the checks -------------------------------------------------------------
// Both directions, because one missing page and one orphan page are different
// mistakes and a single loop would report whichever it met first.

const plotPages = PAGES.filter((page) => page.section === 'plot')
for (const seed of PLOT) {
  if (!plotPages.some((page) => page.slug === seed.id)) {
    throw new Error(
      `plot: "${seed.id}" is on the map but src/content/plot/${seed.id}.md does not exist — ` +
        'a node without a page is a claim with nowhere to check it',
    )
  }
}
for (const page of plotPages) {
  if (!PLOT.some((seed) => seed.id === page.slug)) {
    throw new Error(
      `plot: src/content/plot/${page.slug}.md has no record in src/lib/plot.ts — ` +
        'the map would not draw it, and the page would render without fields',
    )
  }
}
