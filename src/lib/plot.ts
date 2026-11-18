/**
 * The plot: the lab's systems, as records.
 *
 * Two kinds of row, because the lab has two kinds of thing:
 *
 *   starter / seed   a site grown from le.gume, with a front door and a rung
 *   part             a library, tool, app or upstream the sites are built on
 *                    or measured against
 *
 * A row that is a seed still has a page and carries the starter's rules as a
 * claim it can check; a row that is a part has a page too, because a diagram of
 * systems nobody can describe is decoration. Every row is one page at /plot/<id>.
 *
 * This file is the diagram's only input. The canvas draws these objects as
 * tables, `/plot/<id>` renders the same object above the page's prose, and the
 * table under the map prints the same rows. One record, three renderings.
 *
 * Edges are derived, never hand-written:
 *
 *   - every seed has a `cuttingFrom` edge to the starter it was cut from —
 *     provenance, drawn once, not a dependency and not a parent;
 *   - a seed with `vendors` gets a second, dashed edge carrying the version;
 *   - `RELATIONS` draws the cross-cutting claims (a seed publishing against a
 *     part, or a seed's studies running on one).
 *
 * The internal lab DAG — isotope under three tools, lezz.go installing them —
 * is NOT drawn. Ten more lines between seven nodes was a hairball at this
 * size. Each part carries its `depends` as a row, and the panel names the
 * reasons, so the fact is on the page without an unreadable line.
 *
 * Two invariants are checked at import time, which means a violation fails
 * `npm run build` before the guard ever runs:
 *
 *   1. every record has a page at src/content/plot/<id>.md
 *   2. every page in that folder has a record
 */
import { PAGES } from './content'
import { SCALE } from './seeds'
import { PARENT } from './site'

export type Role = 'starter' | 'seed' | 'part'

/** What a reader came for. Every row belongs to exactly one. */
export type GroupId = 'examples' | 'lab' | 'docs'

export const GROUPS: { id: GroupId; label: string; blurb: string }[] = [
  { id: 'examples', label: 'Deployments', blurb: 'the sites you can open' },
  { id: 'lab', label: 'The lab', blurb: 'what runs on the machine' },
  { id: 'docs', label: 'Reading & writing', blurb: 'the tools that edit and read the documentation' },
]

export const ALL_GROUPS: GroupId[] = GROUPS.map((group) => group.id)
export type PartKind = 'library' | 'tool' | 'app' | 'upstream' | 'package' | 'workspace'

/** A default port the service binds, and what answers on it. */
export type Port = {
  port: number
  purpose: string
}

/** A seed's vendored copy of the starter's rules, with the version it was taken at. */
export type Vendors = {
  /** the `le.gume` commit the copy names in its `version:` line */
  version: string
  /** rule ids the seed replaces on the record */
  overrides: string[]
}

type Common = {
  /** route slug: /plot/<id> */
  id: string
  /** the entity name, as its own repository writes it */
  entity: string
  /** one line: what the thing is */
  title: string
  /** deployed origin, without a trailing slash; null when it is not published */
  live: string | null
  /** owner/name on GitHub, or null when the work is held locally */
  repo: string | null
  /** first commit in its own history, when it has one that can be read */
  since?: string
  /** which question this row answers */
  group: GroupId
  /** the one-line reason it exists */
  note: string
  /** default ports the record binds, when it binds any. Omitted is not zero. */
  ports?: Port[]
  /** specified but not implemented: the map must not imply otherwise */
  status?: 'proposal'
  /** where its table sits on the map, in flow coordinates */
  at: { x: number; y: number }
}

export type SeedRow = Common & {
  role: 'starter' | 'seed'
  /** the readiness its front door assumes — the shelf's 1–4, not the 42i rung */
  rung: number
  /** the route a newcomer is meant to open first, on that site */
  front: string
  /** the starter this deploy was cloned from; null on the starter itself.
   *  Provenance, not a parent: nothing is built against it. */
  cuttingFrom: string | null
  /** content sections it kept from the starter */
  keeps: string[]
  /** what it added that the starter does not have */
  adds: string[]
  /** isotopes it publishes, by pickle name */
  ships: string[]
  /** a vendored copy of the starter's rules.md, if it keeps one */
  vendors: Vendors | null
}

export type Dependency = { id: string; verb: string }

export type PartRow = Common & {
  role: 'part'
  kind: PartKind
  language: string
  /** what it does, in one clause */
  provides: string
  /** records it reads, imports, manages or polls, with the verb that says which */
  depends: Dependency[]
}

export type PlotRow = SeedRow | PartRow

/** A claim between two rows. The verb is what the panel prints; the line is unlabelled. */
export type Relation = { from: string; to: string; verb: string }

const NODE_W = 250
const row = (x: number, y: number) => ({ x, y })

export const PLOT: PlotRow[] = [
  // --- the seed family -----------------------------------------------------
  {
    id: 'le.gume',
    group: 'examples',
    entity: 'le.gume',
    title: 'The starter: a documentation site that documents itself',
    role: 'starter',
    rung: 2,
    front: '/docs/quickstart',
    live: PARENT.origin,
    repo: 'james-gibson/le.gume',
    since: '2026-11-11',
    cuttingFrom: null,
    keeps: ['docs', 'seeds', 'factors', 'isotopes', 'guides', 'pitch', 'writing'],
    adds: ['the content model', 'the publish guard', 'rules.md, generated from the guard'],
    ships: ['cornichon', 'silverskin'],
    vendors: null,
    note: 'The starter every site below was cloned from. Its sections are the vocabulary the seeds keep or drop.',
    at: row(655, 0),
  },
  {
    id: 'le.go',
    group: 'examples',
    entity: 'le.go',
    title: 'The 42i system, introduced through citations',
    role: 'seed',
    rung: 1,
    front: '/docs/01-parable',
    live: 'https://james-gibson.github.io/le.go',
    repo: 'james-gibson/le.go',
    since: '2026-11-15',
    cuttingFrom: 'le.gume',
    keeps: ['docs', 'isotopes', 'seeds'],
    adds: [
      'a brick-set design language, with its own components',
      'three live routes: /philosophy, /projector, /draft',
      'citations as the worked domain',
    ],
    ships: ['silverskin'],
    vendors: null,
    note: 'An educational deploy of the seed: how a citation became a magic string, and how to snap it back into bricks.',
    at: row(0, 280),
  },
  {
    id: 'le.gume-energy',
    group: 'examples',
    entity: 'le.gume-energy',
    title: 'A non-identifying, local-time record of one home solar system',
    role: 'seed',
    rung: 0,
    front: '/docs/overview',
    live: 'https://james-gibson.github.io/le.gume-energy',
    repo: 'james-gibson/le.gume-energy',
    since: '2026-11-13',
    cuttingFrom: 'le.gume',
    keeps: ['docs', 'guides', 'isotopes', 'pitch', 'seeds'],
    adds: [
      'a daily export, run by launchd',
      'chart, universe and intervention data as build scripts',
      'a freshness check for the record',
    ],
    ships: ['cornichon', 'silverskin'],
    vendors: { version: '748e35f', overrides: [] },
    note: 'Production, weather, utility usage and the events that explain the gaps — one household, measured, with nothing identifying it.',
    at: row(262, 280),
  },
  {
    id: 'le.gume-shell',
    group: 'examples',
    entity: 'le.gume-shell',
    title: 'A shell for the lab: what runs, where to start, what it costs',
    role: 'seed',
    rung: 3,
    front: '/',
    live: 'https://james-gibson.github.io/le.gume-shell',
    repo: 'james-gibson/le.gume-shell',
    since: '2026-11-15',
    cuttingFrom: 'le.gume',
    keeps: ['docs', 'seeds', 'factors', 'isotopes', 'guides', 'pitch', 'writing'],
    adds: [
      'a lab-operator seed on the shelf',
      'the alarm, dashboard, proxy and tick as the four things that run',
      'a front door written for someone about to touch the machine',
    ],
    ships: ['cornichon', 'dill', 'gherkin', 'piccalilli', 'silverskin'],
    vendors: null,
    note: 'The same seed, a different question: not "what is this" but "what is running, and what happens if I stop it".',
    at: row(524, 280),
  },
  {
    id: 'le.railhead',
    group: 'examples',
    entity: 'le.railhead',
    title: 'A local-time record of an RL environment where a model plays OpenTTD',
    role: 'seed',
    rung: 1,
    front: '/brief/what-railhead-is',
    live: 'https://james-gibson.github.io/le.railhead',
    repo: 'james-gibson/le.railhead',
    since: '2026-11-14',
    cuttingFrom: 'le.gume',
    keeps: ['brief', 'ops', 'research', 'arena', 'seeds', 'verify'],
    adds: [
      'rules.md vendored at build time, with a catch-up check in CI',
      'an override on the record: RULES-02, for three live routes',
      'a rotation record beside the rules copy',
    ],
    ships: [],
    vendors: { version: '29d863e', overrides: ['RULES-02'] },
    note: 'A record of somebody else’s environment, kept to the starter’s rules — and one rule behind them, on purpose, until the next catch-up.',
    at: row(786, 280),
  },
  {
    id: 'that-train-dashboard',
    group: 'examples',
    entity: 'that-train-dashboard',
    title: 'A research team’s dashboard for economic studies run as simulations',
    role: 'seed',
    rung: 1,
    front: '/brief/mission',
    live: 'https://james-gibson.github.io/that-train-dashboard',
    repo: 'james-gibson/that-train-dashboard',
    since: '2026-11-12',
    cuttingFrom: 'le.gume',
    keeps: [],
    adds: [
      '1st-Pouf (claymorphism) instead of the starter’s component library',
      'a studies register, published against le.railhead',
      'rules.md vendored, with one override on the record',
    ],
    ships: [],
    vendors: { version: '29d863e', overrides: ['RULES-06'] },
    note: 'The same content contract, a different cast: a research team writes down what the model can and cannot show.',
    at: row(1048, 280),
  },

  {
    id: 'le.ad',
    group: 'examples',
    entity: 'le.ad',
    title: 'An empty hot desk: six desks, one claim at a time, a lease that returns them',
    role: 'seed',
    rung: 1,
    front: '/',
    live: 'https://james-gibson.github.io/le.ad',
    repo: 'james-gibson/le.ad',
    since: '2026-11-17',
    cuttingFrom: 'le.gume',
    keeps: ['desk', 'isotope', 'docs'],
    adds: [
      'a lease protocol as the content: claim, heartbeat, release, sweep',
      'an installable manifest with web+desk protocol handling and a launch queue consumer',
      'three address forms for one desk, and a claim link that carries a lease',
      'the tuiparts token contract, ported from the terminal to the browser',
    ],
    ships: [],
    vendors: null,
    note: 'The seed that holds no content. It is a connection point: a seed takes a desk, leaves a link, and silence returns the desk to the row.',
    at: row(1572, 280),
  },

  // --- the lab the sites describe and run in -------------------------------
  {
    id: 'isotope',
    group: 'lab',
    entity: 'isotope',
    title: 'A Go library that measures how far a caller has drifted, and what it may still do',
    role: 'part',
    kind: 'library',
    language: 'Go',
    provides: 'the 42i trust protocol: distance from nominal, mapped to a capability rung',
    depends: [],
    live: null,
    repo: 'james-gibson/isotope',
    since: '2026-04-04',
    note: 'The floor under the lab: every tool asks it the same question before letting a caller act.',
    at: row(0, 840),
  },
  {
    id: 'ocd-smoke-alarm',
    group: 'lab',
    entity: 'ocd-smoke-alarm',
    title: 'Continuous health monitoring for HTTP endpoints',
    role: 'part',
    kind: 'tool',
    language: 'Go',
    provides: 'polling, state transitions, regression detection and structured alerts',
    depends: [{ id: 'isotope', verb: 'imports' }],
    ports: [
      { port: 8088, purpose: 'health, /status and the SSE stream' },
      { port: 19100, purpose: 'federation base port, slots 19100–19103' },
      { port: 8877, purpose: 'OAuth mock redirect, when that auth mode is on' },
    ],
    live: null,
    repo: 'james-gibson/smoke-alarm',
    since: '2026-04-03',
    note: 'One binary, two modes: a terminal UI for triage and a service lezz.go starts as a LaunchAgent.',
    at: row(262, 840),
  },
  {
    id: 'adhd',
    group: 'lab',
    entity: 'adhd',
    title: 'Alarm lights in a terminal, and a headless MCP relay in the same binary',
    role: 'part',
    kind: 'tool',
    language: 'Go',
    provides: 'a lights dashboard for alarm state, and a JSONL log relay that registers as an isotope',
    depends: [
      { id: 'isotope', verb: 'imports' },
      { id: 'ocd-smoke-alarm', verb: 'polls over HTTP and SSE' },
    ],
    ports: [
      { port: 9090, purpose: 'MCP and HTTP surface in the shipped example config; unset binds an OS-assigned port' },
    ],
    live: null,
    repo: 'james-gibson/adhd',
    since: '2026-04-03',
    note: 'The thing that turns a monitor’s state into lights, and its log into something a peer can read.',
    at: row(524, 840),
  },
  {
    id: 'local-time',
    group: 'lab',
    entity: 'local-time',
    title: 'Temporal universes, with addresses you can check',
    role: 'part',
    kind: 'library',
    language: 'TypeScript',
    provides: 'epochs, keyframes and cross-universe references under stable declarative ids',
    depends: [],
    live: 'https://james-gibson.github.io/local-time',
    repo: 'james-gibson/local-time',
    since: '2025-09-08',
    note: 'The time model two seed sites publish against: one imports its shape, the other emits a universe of the same kind.',
    at: row(262, 560),
  },
  {
    id: 'lezz.go',
    group: 'lab',
    entity: 'lezz.go',
    title: 'The orchestrator that installs, updates and demos the lab',
    role: 'part',
    kind: 'tool',
    language: 'Go',
    provides: 'managed tool installs and upgrades, self-update, and lezz demo for a whole cluster',
    depends: [
      { id: 'isotope', verb: 'imports' },
      { id: 'ocd-smoke-alarm', verb: 'starts and manages' },
      { id: 'adhd', verb: 'launches as a subprocess' },
    ],
    ports: [
      { port: 19100, purpose: 'discovery registry at /cluster' },
      { port: 19200, purpose: 'prod alarm block start; alarms run 19200–19202' },
      { port: 19210, purpose: 'prod adhd block start; MCP servers on 19210–19212' },
    ],
    live: 'https://james-gibson.github.io/lezz.go',
    repo: 'james-gibson/lezz.go',
    since: '2026-04-02',
    note: 'The only row whose job is the other rows: install them, update them, and start a cluster on demand.',
    at: row(786, 840),
  },
  {
    id: 'le.mon',
    group: 'lab',
    entity: 'le.mon',
    title: 'A set-top display with nothing plugged in — on purpose',
    role: 'part',
    kind: 'app',
    language: 'Swift',
    provides: 'a source contract, a channel dial and an off-air screen that is a real state',
    depends: [],
    live: null,
    repo: null,
    since: '2026-10-27',
    note: 'The display exists before its source does; that is the claim, not an unfinished state.',
    at: row(1048, 560),
  },
  {
    id: 'openttd',
    group: 'lab',
    entity: 'openttd',
    title: 'The sandbox the train studies run in, pinned as a fork',
    role: 'part',
    kind: 'upstream',
    language: 'C++',
    provides: 'an OpenTTD fork specified as an economic regulatory sandbox, with a shell-facing API',
    depends: [],
    ports: [{ port: 3000, purpose: 'platform API and UI (NestJS; the container EXPOSEs it)' }],
    live: null,
    repo: 'gibsunas/openttd',
    since: '2025-10-01',
    note: 'Not a le.gume site and not a lab tool: the simulation those studies measure, and the reason their numbers mean anything.',
    at: row(524, 560),
  },
  {
    id: 'le.roy',
    group: 'lab',
    entity: 'le.roy',
    title: 'Rotate or yield: the claim tool, with jenkins as its loud escape hatch',
    role: 'part',
    kind: 'tool',
    language: 'Go',
    provides: 'check, rotate, yield — and `jenkins`, which always yields and announces the yield over mDNS',
    depends: [{ id: 'lezz.go', verb: 'is specified in' }],
    status: 'proposal',
    live: 'https://james-gibson.github.io/lezz.go',
    repo: 'james-gibson/lezz.go',
    since: '2026-10-26',
    note: 'A proposal, not a binary: it accepts a rotation challenge and refuses everything else. The page says which parts exist today.',
    at: row(1048, 840),
  },
  {
    id: 'lemon-x-files',
    group: 'lab',
    entity: 'lemon-x-files',
    title: 'The Nx workspace template the ade-stand clones and overlays',
    role: 'part',
    kind: 'workspace',
    language: 'TypeScript',
    provides: 'packages, tools and the init/setup scripts a generated lemon workspace is built from',
    depends: [],
    live: null,
    repo: 'gibsunas/lemon-x-files',
    since: '2025-04-01',
    note: 'A template checkout, used read-only: the generator clones it, and nothing here pushes back.',
    at: row(1310, 840),
  },
  {
    id: 'lemon-extract',
    group: 'lab',
    entity: '@lemon/extract',
    title: 'A CLI that reads a TypeScript monorepo’s tsconfigs and says what they include',
    role: 'part',
    kind: 'package',
    language: 'TypeScript',
    provides: 'a count of each tsconfig naming convention, and the files each config pulls in',
    depends: [],
    live: null,
    repo: 'gibsunas/lemon-extract',
    since: '2020-08-08',
    note: 'The published 0.2.11 is narrower than its repository README: the tool that shipped counts tsconfigs, the README describes a cross-repo change plan.',
    at: row(0, 1120),
  },
  {
    id: 'create-ade-stand',
    group: 'lab',
    entity: '@lemon/create-ade-stand',
    title: 'npm create @lemon/ade-stand: an Nx workspace from a template, in one command',
    role: 'part',
    kind: 'package',
    language: 'TypeScript',
    provides: 'a locked, root-refusing generator that clones the template and overlays the generated workspace',
    depends: [{ id: 'lemon-x-files', verb: 'clones and overlays' }],
    live: null,
    repo: 'gibsunas/lemon-ade-stand',
    since: '2025-03-16',
    note: 'Published as @lemon/create-ade-stand to abuse the npm create alias; the repository is lemon-ade-stand.',
    at: row(262, 1120),
  },
  {
    id: 'zaphood',
    entity: 'zaphood',
    title: 'The Office of Z.B. — a 1998 homepage, built on purpose',
    role: 'seed',
    group: 'examples',
    rung: 0,
    front: '/',
    live: 'https://james-gibson.github.io/zaphood',
    repo: 'james-gibson/zaphood',
    since: '2026-11-13',
    cuttingFrom: 'le.gume',
    keeps: [],
    adds: [
      'a component library installed the way a 1998 tutorial would',
      'a marquee, a blink, a tiled background, a visitor counter and a webring',
      'an awards page the Office gave itself',
    ],
    ships: [],
    vendors: { version: '29d863e', overrides: ['RULES-06'] },
    note: 'A seed cloned from the starter that breaks every polite rule of the internet on purpose: the content model survives the taste.',
    at: row(1310, 280),
  },
  {
    id: 'hweat-penny',
    entity: 'hweat-penny',
    title: 'Hwheat Penny — one penny, one rotation, counted',
    role: 'part',
    group: 'examples',
    kind: 'app',
    language: 'TypeScript',
    provides: 'a single-page explainer of the penny, the rotation and the isotope, with a voice',
    depends: [],
    live: 'https://james-gibson.github.io/hweat-penny',
    repo: 'james-gibson/hweat-penny',
    since: '2026-11-14',
    note: 'The lab calls it le.hweat-penny; the repository does not. A site, not a seed: no content tree, no guard.',
    at: row(0, 560),
  },
  {
    id: 'fire-marshall',
    entity: 'fire-marshall',
    title: 'The counter display: protection catalogue against configured state',
    role: 'part',
    group: 'lab',
    kind: 'tool',
    language: 'Go · React',
    provides: 'a read-only board counting occupancy against capacity, protection by protection',
    depends: [
      { id: 'adhd', verb: 'is the counter display to' },
      { id: 'synapse', verb: 'resolves its catalogue against' },
    ],
    ports: [{ port: 19120, purpose: 'the dashboard, bound to the loopback interface as a lezz service' }],
    live: null,
    repo: null,
    since: '2026-10-08',
    note: 'A fire marshal board does not report the show: it counts occupancy, names the exits and shows the alarm.',
    at: row(786, 560),
  },
  {
    id: 'lezz.sea',
    entity: 'lezz.sea',
    title: 'A macOS window on an adhd cluster: lights, traffic, isotopes, scenarios',
    role: 'part',
    group: 'lab',
    kind: 'app',
    language: 'Swift',
    provides: 'a desktop client for adhd lights and JSONL traffic, and a reader for smoke-alarm scenarios',
    depends: [
      { id: 'adhd', verb: 'shows the lights and log of' },
      { id: 'ocd-smoke-alarm', verb: 'reads the scenarios and isotope matrix of' },
    ],
    live: null,
    repo: 'james-gibson/lezz.sea',
    since: '2026-10-21',
    note: 'The same information as a terminal and a log file, arranged for a person looking at a window instead.',
    at: row(1310, 560),
  },
  {
    id: 'synapse',
    entity: 'synapse',
    title: 'The code-knowledge graph an agent reads instead of grepping',
    role: 'part',
    group: 'docs',
    kind: 'tool',
    language: 'Elixir',
    provides: 'indexed search, whole-file reads, call edges and an index-status surface',
    depends: [],
    ports: [
      { port: 8585, purpose: 'the MCP server (HTTP)' },
      { port: 8587, purpose: 'the lab mirror that owns the MCP session' },
    ],
    live: null,
    repo: null,
    since: '2026-10-08',
    note: 'A local service with no published source: the index is on this machine, and so is the mirror that survives its restarts.',
    at: row(1572, 840),
  },
  {
    id: 'opencode',
    entity: 'opencode',
    title: 'The agent harness this page was written in',
    role: 'part',
    group: 'docs',
    kind: 'app',
    language: 'TypeScript',
    provides: 'a TUI, a local HTTP server and an SDK for running agents against a repository',
    depends: [],
    ports: [{ port: 4096, purpose: 'default opencode serve port; the TUI assigns a random one unless pinned' }],
    live: 'https://opencode.ai',
    repo: 'sst/opencode',
    note: 'The harness that reads the vault and writes the pages; its server is the door an SDK or an IDE plugin uses.',
    at: row(524, 1120),
  },
  {
    id: 'openknowledge',
    entity: 'openknowledge',
    title: 'A local Markdown editor and LLM wiki',
    role: 'part',
    group: 'docs',
    kind: 'app',
    language: 'TypeScript',
    provides: 'a desktop editor with MCP integrations; local-first, no account',
    depends: [],
    live: 'https://openknowledge.ai',
    repo: 'inkeep/open-knowledge',
    since: '2026-06-03',
    note: 'Where the Markdown is edited by hand; the site is built from the same files, so the editor never owns the truth.',
    at: row(786, 1120),
  },
  {
    id: 'obsidian',
    entity: 'obsidian',
    title: 'A local Markdown vault with plugins',
    role: 'part',
    group: 'docs',
    kind: 'app',
    language: 'Electron',
    provides: 'a vault on disk, a plugin surface and a graph view',
    depends: [],
    live: 'https://obsidian.md',
    repo: null,
    note: 'One of the editors that can open the vault. Nothing on this plot depends on it, which is the point of plain files.',
    at: row(1048, 1120),
  },
  {
    id: 'zed',
    entity: 'zed',
    title: 'An editor with an agent panel, written in Rust',
    role: 'part',
    group: 'docs',
    kind: 'app',
    language: 'Rust',
    provides: 'a fast editor, a multi-buffer and an agent panel that speaks to a harness',
    depends: [],
    live: 'https://zed.dev',
    repo: 'zed-industries/zed',
    note: 'The editor in the reading stack: it opens the same files, and the harness does the writing.',
    at: row(1310, 1120),
  },
  {
    id: 'xcode',
    entity: 'xcode',
    title: 'Apple’s IDE and toolchain',
    role: 'part',
    group: 'docs',
    kind: 'app',
    language: 'Swift · Objective-C',
    provides: 'the compiler and simulator that build le.mon',
    depends: [],
    live: 'https://developer.apple.com/xcode/',
    repo: null,
    note: 'The one row that exists for a single build: le.mon is Swift, and nothing else here needs Apple’s toolchain.',
    at: row(1572, 1120),
  },]

/** The claims a line draws. Inheritance and vendors are derived from the rows above. */
export const RELATIONS: Relation[] = [
  {
    from: 'le.gume-energy',
    to: 'local-time',
    verb: 'publishes a universe shaped like',
  },
  {
    from: 'le.railhead',
    to: 'local-time',
    verb: 'publishes a universe of',
  },
  {
    from: 'that-train-dashboard',
    to: 'le.railhead',
    verb: 'publishes its studies against',
  },
  {
    from: 'that-train-dashboard',
    to: 'openttd',
    verb: 'runs its studies on',
  },
  {
    from: 'create-ade-stand',
    to: 'lemon-x-files',
    verb: 'clones and overlays',
  },
  {
    from: 'lezz.go',
    to: 'le.roy',
    verb: 'specifies (as a proposal)',
  },
  {
    from: 'fire-marshall',
    to: 'adhd',
    verb: 'is the counter display to',
  },
  {
    from: 'fire-marshall',
    to: 'synapse',
    verb: 'resolves its catalogue against',
  },
  {
    from: 'lezz.sea',
    to: 'adhd',
    verb: 'shows the lights and log of',
  },
  {
    from: 'lezz.sea',
    to: 'ocd-smoke-alarm',
    verb: 'reads the scenarios and isotopes of',
  },
  {
    from: 'le.ad',
    to: 'isotope',
    verb: 'proposes the desk-claim isotope to',
  },
]

export function getPlotRow(id: string): PlotRow | undefined {
  return PLOT.find((seed) => seed.id === id)
}

export function seeds(): SeedRow[] {
  return PLOT.filter((row): row is SeedRow => row.role !== 'part')
}

/** The cuttings taken from the starter, in map order — not its children; see PLOT-01. */
export function cuttings(): SeedRow[] {
  return PLOT.filter((row): row is SeedRow => row.role === 'seed')
}

export function parts(): PartRow[] {
  return PLOT.filter((row): row is PartRow => row.role === 'part')
}

export function relationsOf(id: string): Relation[] {
  return RELATIONS.filter((relation) => relation.from === id || relation.to === id)
}

export function rungLabel(rung: number): string {
  return SCALE[rung]?.label ?? 'Unstated'
}

export const KIND_LABEL: Record<PartKind, string> = {
  library: 'library',
  tool: 'tool',
  app: 'app',
  upstream: 'upstream',
  package: 'package',
  workspace: 'workspace',
}

export { NODE_W }

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

// PLOT-03: one cell per row. A shared coordinate is two tables on top of each
// other — invisible in the record, unreadable on the map, and exactly the kind
// of mistake a new row invites when it is appended to a full column.
const cells = new Map<string, string>()
for (const entry of PLOT) {
  const key = `${entry.at.x}:${entry.at.y}`
  const taken = cells.get(key)
  if (taken) {
    throw new Error(
      `plot: "${entry.id}" and "${taken}" are both at ${key} — one cell per row (PLOT-03)`,
    )
  }
  cells.set(key, entry.id)
}

// PLOT-04: a row carries the evidence its layer promises. The layer is a claim
// about what the row can prove, so a missing field is a table that argues
// nothing.
for (const entry of PLOT) {
  // Narrow on `part` first: `starter` is a SeedRow, so an `else` after a
  // `seed` test would still be a union and the part fields would not exist.
  if (entry.role === 'part') {
    if (!entry.provides.trim()) {
      throw new Error(`plot: part "${entry.id}" does not say what it provides`)
    }
    if (!entry.kind) {
      throw new Error(`plot: part "${entry.id}" has no kind`)
    }
    continue
  }
  if (!entry.front.startsWith('/')) {
    throw new Error(`plot: seed "${entry.id}" has front "${entry.front}", which is not a route`)
  }
  if (!entry.live || !entry.live.startsWith('https://')) {
    throw new Error(
      `plot: seed "${entry.id}" is not published on https — a deployment with no origin is a repository (PLOT-01)`,
    )
  }
}

// A relation that points at a row the map does not hold is a line to nowhere.
for (const relation of RELATIONS) {
  for (const id of [relation.from, relation.to]) {
    if (!PLOT.some((row) => row.id === id)) {
      throw new Error(`plot: relation "${relation.from} → ${relation.to}" names "${id}", which is not a row`)
    }
  }
}
