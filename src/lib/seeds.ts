import { PAGES, type Page } from './content'

/**
 * Seeds, on a scale.
 *
 * A seed is a body of knowledge with three things stated up front: who it is
 * for, what it assumes, and where it starts. The scale adds the fourth: **how
 * much of the machine the audience is willing to touch**.
 *
 *     rung 1  Understand  reads concepts; still will not deploy anything
 *     rung 2  Learn       runs it locally, breaks it on purpose
 *     rung 3  Operate     delegates the running, wants it repeatable
 *     rung 4  Package     designs systems other people will operate
 *
 * A rung is a level, not a slot: several seeds may share one when they ask the
 * same readiness of the reader. `scale()` groups them for the shelf.
 *
 * Rungs are about readiness, not seniority: a reader at rung 1 is not a
 * beginner, and must never be handed a page that assumes a terminal. This site
 * starts at rung 1 because the map is the point — the diagram answers "what
 * exists" before anyone is asked to clone anything.
 *
 * Membership is derived from `seeds:` in page frontmatter, so a seed's contents
 * cannot drift from the pages that declare them. A page may belong to several
 * seeds: that is what "shared" means here.
 */

export type Seed = {
  /** the slug of its page in /seeds, and the id used in frontmatter */
  id: string
  title: string
  /** who this is written for, in one line */
  audience: string
  /** what they must already know — "nothing" is a valid and useful answer */
  assumes: string
  /** three claims the seed makes good on */
  teaches: string[]
  /** the route a newcomer should open first */
  entry: string
  /** the level this seed assumes; several seeds may share a rung */
  rung?: number
  /** what this audience does with the machine */
  touches: string
  /** register, not readiness — sits alongside every rung */
  lateral?: boolean
  /** a site-scoped seed is a view of the whole shelf, not a subset of it */
  scope?: 'site' | 'entrance'
}

/**
 * The rung table. A seed references one; the reference is many-to-one, so any
 * number of seeds may point at the same level.
 */
export const SCALE: Record<number, { label: string; touches: string }> = {
  1: { label: 'Understand', touches: 'reads concepts; will not deploy anything' },
  2: { label: 'Learn', touches: 'runs it locally and breaks it on purpose' },
  3: { label: 'Operate', touches: 'delegates the running; wants it repeatable' },
  4: { label: 'Package', touches: 'designs systems other people will operate' },
}

export const SEEDS: Seed[] = [
  {
    id: 'reader',
    title: 'The reader',
    audience: 'Someone who has found one le.gume site and wants to know what else was grown from it.',
    assumes: 'A browser. No terminal, no clone, no account.',
    teaches: [
      'which seeds exist, and what each one changed',
      'how an inheritance claim is checked, rather than believed',
      'why the map fits on one page while the sites do not',
    ],
    entry: '/',
    rung: 1,
    touches: 'reads the map; will not open a terminal',
  },
  {
    id: 'grower',
    title: 'The grower',
    audience: 'An engineer who wants to run a seed as it ships, or start one from the starter.',
    assumes: 'Git and Node 22. No documentation tooling.',
    teaches: [
      'the clone, install, build loop, and what the guard refuses',
      'which parts of the starter are the kit and which are the starter’s own argument',
      'what a seed costs to keep: a page, a record, a check',
    ],
    entry: '/plot/le.gume',
    rung: 2,
    touches: 'runs it locally and breaks it on purpose',
  },
  {
    id: 'maintainer',
    title: 'The maintainer',
    audience: 'The person keeping a child in step with the starter’s rules, and deciding what to keep.',
    assumes: 'You have cloned the seed, and you own at least one of its pages.',
    teaches: [
      'what the inherited-page audit is for, and how it fails quietly',
      'how rules.md is vendored, versioned and overridden on the record',
      'which inherited pages this site deleted, and why',
    ],
    entry: '/docs/inherited',
    rung: 3,
    touches: 'delegates the running; wants it repeatable',
  },
  {
    id: 'packager',
    title: 'The packager',
    audience: 'Someone designing the next seed, and the isotope it should ship back to the starter.',
    assumes: 'You can read TypeScript, and you have argued with a schema.',
    teaches: [
      'the record shape, and why the fields live in code rather than prose',
      'the two-way check that stops a map from drifting off its pages',
      'what makes an addition an isotope rather than a preference',
    ],
    entry: '/docs/data-model',
    rung: 4,
    touches: 'designs systems other people will operate',
  },
]

export function getSeed(id: string): Seed | undefined {
  return SEEDS.find((seed) => seed.id === id)
}

/** Pages that declare this seed, in section order. */
export function seedMembers(id: string): Page[] {
  const seed = getSeed(id)
  if (seed?.scope === 'site') return PAGES.filter((page) => page.section !== 'seeds')
  return PAGES.filter((page) => page.seeds.includes(id))
}

/** Seeds a page belongs to. */
export function seedsOf(page: Page): Seed[] {
  return page.seeds.map(getSeed).filter((seed): seed is Seed => !!seed)
}

/** Seeds that sit alongside every rung rather than on one. */
export function lateralSeeds(): Seed[] {
  return SEEDS.filter((seed) => seed.lateral)
}

/** The rungs, with the seeds that sit on each. */
export function scale(): { level: number; label: string; touches: string; seeds: Seed[] }[] {
  return Object.entries(SCALE)
    .map(([level, step]) => ({
      level: Number(level),
      ...step,
      seeds: SEEDS.filter((seed) => seed.rung === Number(level)),
    }))
    .sort((a, b) => a.level - b.level)
}
