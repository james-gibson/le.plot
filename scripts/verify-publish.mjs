#!/usr/bin/env node
/**
 * The publish guard.
 *
 * A public documentation site is a small, permanent promise. This file is the
 * only thing standing between a careless build and that promise, so every check
 * below names the failure it prevents and fails with a message a human can act
 * on.
 *
 * Run after `vite build` (it is part of `npm run build`), or standalone with
 * `npm run guard` against an existing dist/.
 *
 * Exit 1 on the first class of failure that is not merely advisory.
 */
import { readFileSync } from 'node:fs'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const DIST = 'dist'
const failures = []
const notes = []

function fail(check, detail) {
  failures.push({ check, detail })
}

async function readText(path) {
  return readFile(path, 'utf8')
}

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

// --- 1. the output exists and is the shape Pages expects -------------------
let files
try {
  files = await walk(DIST)
} catch {
  console.error('guard: dist/ is missing — run `npm run build` first')
  process.exit(1)
}

const rel = files.map((f) => relative(DIST, f))
for (const required of [
  'index.html',
  '404.html',
  '.nojekyll',
  'favicon.svg',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
]) {
  if (!rel.includes(required)) {
    fail('required-file', `${required} is missing from dist/ (see scripts/postbuild.mjs)`)
  }
}

const indexHtml = await readText(join(DIST, 'index.html')).catch(() => '')
const notFoundHtml = await readText(join(DIST, '404.html')).catch(() => '')

// Every shell carries its own prerendered markup now, so identical files are no
// longer the invariant. The invariant is that every shell boots the same
// application: a deep link must start the app, not serve a stale page.
const appScript = /<script[^>]+src="[^"]*assets\/index-[^"]+\.js"/.exec(indexHtml)?.[0]
if (!appScript) {
  fail('spa-fallback', 'dist/index.html does not load the application bundle')
} else if (notFoundHtml && !notFoundHtml.includes(appScript)) {
  fail('spa-fallback', 'dist/404.html does not load the application bundle')
}

// --- 2. the base path agrees with the deployed location -------------------
// package.json `homepage` is the single declaration of where this site lives.
const pkg = JSON.parse(await readText('package.json'))
const expectedBase = pkg.homepage ? new URL(pkg.homepage).pathname : '/'
if (!indexHtml.includes(`${expectedBase}assets/`)) {
  fail(
    'base-path',
    `index.html does not load assets from ${expectedBase}assets/ — check vite.config.ts base ` +
      `against package.json homepage`,
  )
}

// The mount itself ("/le.plot") is legitimate — it is the home link. Anything
// else must sit under it.
const mount = expectedBase.replace(/\/$/, '')
const rootRefs = [...indexHtml.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1])
for (const ref of rootRefs) {
  if (ref !== mount && !ref.startsWith(expectedBase)) {
    fail('base-path', `index.html references ${ref}, which escapes the mount ${expectedBase}`)
  }
}

// --- 3. nothing shipped points back at source or at a map -----------------
for (const file of rel) {
  if (file.endsWith('.map')) fail('sourcemap', `${file} is a source map; set sourcemap: false`)
}
const scripts = files.filter((f) => f.endsWith('.js'))
const jsText = (await Promise.all(scripts.map((f) => readText(f)))).join('\n')

if (/\/src\/[A-Za-z0-9_-]+\.(?:tsx?|css)/.test(indexHtml) || /from\s*"\/src\//.test(jsText)) {
  fail('dev-paths', 'output refers to /src/ — a dev server URL leaked into the bundle')
}

// --- 4. placeholders in shipped markup ------------------------------------
// Scope: the HTML shells. Prose lives in the JS bundle, where these words can be
// legitimate documentation, so scanning it would flag this very file's subject.
const placeholder = /\b(?:TODO|FIXME|lorem ipsum)\b|example\.com/i
for (const [name, html] of [
  ['index.html', indexHtml],
  ['404.html', notFoundHtml],
]) {
  if (placeholder.test(html)) fail('placeholder', `${name} still contains a placeholder`)
}

// --- 5. nothing private or secret-looking anywhere ------------------------
const leakPatterns = [
  [/\/Users\/[A-Za-z0-9._-]+/, 'an absolute macOS home path'],
  [/\/home\/[A-Za-z0-9._-]+/, 'an absolute Linux home path'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'a private key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'an AWS access key id'],
  [/\bsk-(?:live|proj|ant)-[A-Za-z0-9_-]{16,}/, 'an API secret'],
  [/\b(?:password|passwd|secret|token)\s*[:=]\s*["'][^"']{8,}["']/i, 'a hardcoded credential'],
  [/127\.0\.0\.1:\d+/, 'a loopback URL'],
  [/localhost:\d+/, 'a localhost URL'],
]
for (const [pattern, what] of leakPatterns) {
  const hit = jsText.match(pattern) ?? indexHtml.match(pattern)
  if (hit) fail('leak', `output contains ${what}: ${hit[0].slice(0, 60)}`)
}

// --- 6. every real route has its own shell, and the content is in the bundle -
const contentFiles = (await walk('src/content')).filter((f) => f.endsWith('.md'))
if (contentFiles.length === 0) fail('content', 'src/content/**/*.md matched nothing')

const sections = [...new Set(contentFiles.map((f) => relative('src/content', f).split('/')[0]))]
const routes = [...sections, ...contentFiles.map((f) => relative('src/content', f).replace(/\.md$/, ''))]

for (const route of routes) {
  try {
    await access(join(DIST, route, 'index.html'))
  } catch (error) {
    // Only a missing file is the finding; anything else is this script being wrong.
    if (!error || error.code !== 'ENOENT') throw error
    fail(
      'route-shell',
      `dist/${route}/index.html is missing — GitHub Pages would answer 404 for /${route}`,
    )
  }
}

for (const file of contentFiles) {
  const route = relative('src/content', file).replace(/\.md$/, '')
  const source = await readText(file)
  const title = /^title:\s*(.+)$/m.exec(source)?.[1]?.trim().replace(/^["']|["']$/g, '')
  if (!title) {
    fail('content', `${file} has no title: in frontmatter`)
    continue
  }
  // Every isotope page is a compound and must declare its slots, even if none.
  // `what-is-an-isotope.md` explains the format; it is not itself an isotope.
  const isFormatPage = route === 'isotopes/what-is-an-isotope'
  if (route.startsWith('isotopes/') && !isFormatPage && !/^slots:/m.test(source)) {
    fail(
      'isotope',
      `${file} is an isotope but has no \`slots:\` frontmatter (use \`slots: none\`)`,
    )
  }
  // Announcing the presumptions is what makes two isotopes comparable: an
  // attack surface is only assessable against a stated runtime and era.
  if (route.startsWith('isotopes/') && !isFormatPage && !/^presumes:/m.test(source)) {
    fail(
      'isotope',
      `${file} is an isotope but never announces \`presumes:\` (runtime, platform, permissions)`,
    )
  }
  // React escapes nothing in JS string literals, but the bundler may split
  // long strings; a title is short enough to appear whole.
  if (!jsText.includes(title)) {
    fail('content', `${file} ("${title}") is not present in the built bundle`)
  }
}

// --- 7. internal links point at routes that exist -------------------------
// Markdown authors write root-absolute links ("/docs/quickstart") because that
// is how the site reads in a browser. The mount prefix is applied at render
// time, so the check here is against routes, not against the built HTML.
const knownRoutes = new Set([
  '/',
  '/design',
  '/palette',
  ...sections.map((s) => `/${s}`),
  ...contentFiles.map((f) => `/${relative('src/content', f).replace(/\.md$/, '')}`),
])
const knownFiles = new Set(['/llms.txt', '/robots.txt', '/feed.xml', '/favicon.svg', '/deck.html'])
for (const file of contentFiles) {
  const source = await readText(file)
  for (const match of source.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const target = match[1].replace(/#.*$/, '').replace(/\/$/, '') || '/'
    if (knownRoutes.has(target) || knownFiles.has(target)) continue
    fail('link', `${file} links to ${match[1]}, which is not a route on this site`)
  }
}

// --- 8. the machine entry lists every page -------------------------------
// llms.txt is how an agent takes the site without crawling it. A page missing
// from it is a page the site does not admit to having.
const llms = rel.includes('llms.txt') ? await readText(join(DIST, 'llms.txt')) : ''
if (!llms) {
  fail('llms', 'dist/llms.txt is empty or missing (see scripts/postbuild.mjs)')
} else {
  for (const file of contentFiles) {
    const route = relative('src/content', file).replace(/\.md$/, '')
    if (!llms.includes(`/${route}/)`)) {
      fail('llms', `dist/llms.txt does not list /${route}`)
    }
  }
  for (const anchor of ['## For agents', '## Invariants', '## Build and verify', '## Isotope shortcuts']) {
    if (!llms.includes(anchor)) fail('llms', `dist/llms.txt is missing the "${anchor}" section`)
  }
}

// --- 10. seeds are declared, populated and resolvable ---------------------
// A seed promises an audience an entrance. The registry is TypeScript, so it is
// read as text here: ids and entry routes, then cross-checked against the pages
// that declare membership in frontmatter.
const seedsSource = await readText('src/lib/seeds.ts').catch(() => '')
const seedIds = [...seedsSource.matchAll(/^\s{4}id: '([^']+)'/gm)].map((m) => m[1])
const seedEntries = [...seedsSource.matchAll(/^\s{4}entry: '([^']+)'/gm)].map((m) => m[1])
const seedRungs = [...seedsSource.matchAll(/^\s{4}rung: (-?\d+),/gm)].map((m) => Number(m[1]))
const seedLaterals = [...seedsSource.matchAll(/^\s{4}lateral: true,/gm)].length

if (!seedIds.length) fail('seeds', 'no seeds found in src/lib/seeds.ts')

// The ladder: rungs unique, ascending in file order, lateral seeds last.
for (let i = 1; i < seedRungs.length; i += 1) {
  if (seedRungs[i] <= seedRungs[i - 1]) {
    fail('seeds', `rungs are out of order: ${seedRungs[i - 1]} then ${seedRungs[i]}`)
  }
}
if (seedLaterals && seedIds.length - seedLaterals !== seedRungs.length) {
  fail('seeds', 'a lateral seed must come after every runged seed')
}

// Each seed's page must appear in the same order as the registry.
const seedPageOrders = seedIds.map((id) => {
  const source = contentFiles.find((f) => f.endsWith(`seeds/${id}.md`))
  if (!source) return Number.NaN
  const order = /^order:\s*(\d+)/m.exec(readFileSync(source, 'utf8'))?.[1]
  return Number(order ?? Number.NaN)
})
for (let i = 1; i < seedPageOrders.length; i += 1) {
  if (!(seedPageOrders[i] > seedPageOrders[i - 1])) {
    fail(
      'seeds',
      `the shelf disagrees with the ladder: ${seedIds[i - 1]} (order ${seedPageOrders[i - 1]}) ` +
        `does not sit before ${seedIds[i]} (order ${seedPageOrders[i]})`,
    )
  }
}

const seedMembers = new Map()
for (const file of contentFiles) {
  const line = /^seeds:\s*(.+)$/m.exec(await readText(file))?.[1]
  if (!line) continue
  for (const id of line.split(',').map((value) => value.trim()).filter(Boolean)) {
    if (!seedIds.includes(id)) fail('seeds', `${file} declares unknown seed "${id}"`)
    seedMembers.set(id, (seedMembers.get(id) ?? 0) + 1)
  }
}

// A site-scoped seed is a view of the whole shelf, so it has no member list.
const scopedSeeds = new Set(
  seedIds.filter((id) => {
    const start = seedsSource.indexOf(`id: '${id}'`)
    const next = seedsSource.indexOf(`id: '`, start + 5)
    return /scope: '(site|entrance)'/.test(seedsSource.slice(start, next === -1 ? undefined : next))
  }),
)

for (const id of seedIds) {
  if (!/^[a-z0-9-]+$/.test(id)) fail('seeds', `seed id "${id}" must be a lowercase slug`)
  if (!seedMembers.get(id) && !scopedSeeds.has(id)) {
    fail('seeds', `seed "${id}" has no page declaring \`seeds: ${id}\``)
  }
  if (!rel.includes(`seeds/${id}/index.html`)) {
    fail('seeds', `seed "${id}" has no page at src/content/seeds/${id}.md`)
  }
}

for (const entry of seedEntries) {
  const route = entry.replace(/\/$/, '') || '/'
  if (!knownRoutes.has(route) && !knownFiles.has(route)) {
    fail('seeds', `seed entrance ${entry} is not a route or a served file`)
  }
}

// --- 12. the deck is a file you could hand over ---------------------------
// It has to open from file:// on a machine that has never seen this project:
// no script, no network, a sane number of slides, and small enough to copy
// without thinking about it.
const deck = await readText('dist/deck.html').catch(() => '')
if (!deck) {
  fail('deck', 'dist/deck.html is missing — scripts/deck.mjs writes it')
} else {
  if (/<script/i.test(deck)) {
    fail('deck', 'dist/deck.html contains a <script> — it must open with no application')
  }
  const slides = (deck.match(/<section/g) ?? []).length
  if (slides < 6) fail('deck', `dist/deck.html has ${slides} slides; the pitch needs at least 6`)
  if (deck.length > 250_000) {
    fail('deck', `dist/deck.html is ${(deck.length / 1024).toFixed(0)}KB — over the 250KB budget`)
  }
  if (!/built \d{4}-\d{2}-\d{2} from [0-9a-f]{4,}/.test(deck)) {
    fail('deck', 'dist/deck.html has no dated commit in its footer — a deck is a claim with a timestamp')
  }
}

// --- 13. one door for agents ----------------------------------------------
// Agent capability varies from a model that can follow one instruction to one
// that will invent a plan. The only thing that serves both is a single, stable
// payload and a single place it is printed. A second payload is a second door.
const srcFiles = await walk('src').catch(() => [])
const tsSources = (
  await Promise.all(srcFiles.filter((f) => /\.(ts|tsx)$/.test(f)).map((f) => readText(f)))
).join('\n')

const payloads = (tsSources.match(/Read https:\/\//g) ?? []).length
if (payloads !== 1) {
  fail('agents', `found ${payloads} agent payload strings in src/ — there must be exactly one`)
}
if (!/export const SITE_HANDOFF/.test(tsSources)) {
  fail('agents', 'SITE_HANDOFF is not exported — the door has no constant')
}
const footer = await readText('src/components/SiteFooter.tsx').catch(() => '')
if (!footer.includes('<AgentCta')) {
  fail('agents', 'SiteFooter does not render the agent call to action')
}

// --- 14. agent-ready: find and read --------------------------------------
// AgentReady's essentials, checked because a claim in a page is worth what the
// build enforces. Act is out of scope: this is a site to read, not a product to
// transact through, so no MCP server or CLI is claimed.
const ORIGIN = 'https://james-gibson.github.io/le.plot'

const robots = await readText('dist/robots.txt').catch(() => '')
if (!/^User-agent: \*/m.test(robots)) {
  fail('agent-ready', 'dist/robots.txt has no wildcard rule — one policy for all agents')
}
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) {
  fail('agent-ready', 'dist/robots.txt does not point at the sitemap')
}

const sitemap = await readText('dist/sitemap.xml').catch(() => '')
for (const route of ['', ...routes.map((r) => `${r}/`), 'deck.html']) {
  const loc = route ? `${ORIGIN}/${route}` : `${ORIGIN}/`
  if (!sitemap.includes(`<loc>${loc}</loc>`)) {
    fail('agent-ready', `dist/sitemap.xml is missing ${loc}`)
  }
}

const catalogSource = await readText('dist/.well-known/ai-catalog.json').catch(() => '')
if (!catalogSource) {
  fail('agent-ready', 'dist/.well-known/ai-catalog.json is missing')
} else {
  try {
    const catalog = JSON.parse(catalogSource)
    if (!JSON.stringify(catalog).includes('/llms.txt')) {
      fail('agent-ready', 'the AI catalog does not list llms.txt')
    }
  } catch {
    fail('agent-ready', 'dist/.well-known/ai-catalog.json is not JSON')
  }
}

// AR-READ-01: the answer is in the initial HTML. Every shell must carry its
// page as markup, not only as a script tag that would build it.
const shells = (await walk(DIST)).filter((f) => f.endsWith('index.html') || f.endsWith('404.html'))
if (shells.length < routes.length) {
  fail('agent-ready', `found ${shells.length} HTML shells for ${routes.length} routes`)
}
for (const shell of shells) {
  const html = await readText(shell)
  if (!/<h1[\s>]/.test(html)) {
    fail('agent-ready', `${shell} has no <h1> in the initial HTML — the answer is JavaScript-only`)
  }
}

// --- 15. child seeds ship back -------------------------------------------
// The upstream rule is a norm, not a mechanism — but a norm nobody can find is
// not a norm. The skill states it and this check refuses a build where the
// statement has been deleted during a refactor.
const skill = await readText('.opencode/skills/le-plot-content/SKILL.md').catch(() => '')
if (!/Child seeds ship back/.test(skill)) {
  fail('upstream', 'the skill no longer states the child-seed upstream rule')
}
if (!/upstream/i.test(skill) || !/isotope/i.test(skill)) {
  fail('upstream', 'the upstream rule no longer mentions isotopes or upstreaming')
}

// --- 16. the feed is generated and complete ------------------------------
// A feed is a build artefact, not a service. If it stops listing a page, the
// claim that a feed needs a garden stops being true here.
const feed = await readText('dist/feed.xml').catch(() => '')
if (!feed) {
  fail('feed', 'dist/feed.xml is missing')
} else {
  for (const route of routes) {
    if (!feed.includes(`${ORIGIN}/${route}/`)) fail('feed', `dist/feed.xml is missing ${route}`)
  }
}

// --- 17. rules.md is the parent's, not this repository's -----------------
// The starter publishes rules.md because it has children that defer to it.
// This seed is a leaf: it publishes no rules for anyone, points at the parent's
// copy, and records the decision on /docs/inherited. A rule file generated here
// would be a second source of truth with no version check — the exact failure
// the map documents in its children.
const rulesFile = await readText('dist/rules.md').catch(() => '')
if (rulesFile) {
  fail('rules', 'dist/rules.md exists — this seed is a leaf and does not publish rules')
}

// --- 17. size sanity ------------------------------------------------------
const total = (await Promise.all(files.map(async (f) => (await stat(f)).size))).reduce(
  (a, b) => a + b,
  0,
)
const budgetMb = 8
if (total > budgetMb * 1024 * 1024) {
  fail('size', `dist/ is ${(total / 1024 / 1024).toFixed(1)}MB, over the ${budgetMb}MB budget`)
}
notes.push(`${rel.length} files, ${(total / 1024).toFixed(0)}KB total`)

// --- the plot's own rule --------------------------------------------------
// PLOT-01 is the plot's rule and it is the plot's to publish — but this seed is
// a leaf: it publishes no rules.md, because there is no child to defer to one.
// The rule is a page instead, and this check is what stops a refactor deleting
// the paragraph while every other check stays green.
const admission = await readText(join(DIST, 'docs/admission/index.html')).catch(() => '')
if (!admission) {
  fail('rules', 'dist/docs/admission/index.html is missing — PLOT-01 lives there')
} else {
  if (!/A row is added when the plot can observe the system/.test(admission)) {
    fail('rules', 'the admission page no longer states PLOT-01')
  }
  if (!/Provenance is not an admission test/.test(admission)) {
    fail('rules', 'the admission page no longer separates provenance from admission')
  }
  if (!/may not be the only route to a row/.test(admission)) {
    fail('rules', 'PLOT-05 has gone: a scope must not become the only route to a row')
  }
}
const plotSource = await readText('src/lib/plot.ts').catch(() => '')
for (const marker of ['PLOT-03: one cell per row', 'PLOT-04: a row carries the evidence']) {
  if (!plotSource.includes(marker)) {
    fail('rules', `src/lib/plot.ts no longer carries "${marker}" — the rule's arithmetic half is gone`)
  }
}

// --- the rule set and the arithmetic -------------------------------------
// The family's claim is that a page states the rules the Go programs enforce and
// the arithmetic they use. The doctor cannot read a Go repository from this
// build, so it does the two things it can: it refuses a build where the claim
// has gone, and it pins the seven ceilings so the table cannot silently rot.
const ruleSet = await readText(join(DIST, 'docs/one-rule-set/index.html')).catch(() => '')
if (!ruleSet) {
  fail('rules', 'dist/docs/one-rule-set/index.html is missing — the family claim lives there')
} else {
  if (!/the rules the Go programs enforce/i.test(ruleSet)) {
    fail('rules', 'the rule-set page no longer states that the rules are the programs\' rules')
  }
  // The ceilings are a table in the page, so read the rows: the first cell is the
  // rung, the third is its ceiling. Matching bare numbers would pin the prose,
  // which repeats "0" and "20" in half a dozen places and would pass a table
  // that had been reordered.
  const expected = [0, 20, 60, 100, 140, 180, 220]
  const rows = [...ruleSet.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
    .map((match) =>
      [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((cell) =>
        cell[1].replace(/<[^>]+>/g, '').trim(),
      ),
    )
    .filter((cells) => cells.length === 3 && /^\d+$/.test(cells[0]))
  const ladder = rows.map((cells) => Number(cells[2]))
  if (ladder.join(',') !== expected.join(',')) {
    fail(
      'rules',
      `the rule-set page's ladder reads ${ladder.join(',') || '(nothing)'}, not ${expected.join(',')} — ` +
        'the seven ceilings are the arithmetic, and they are pinned here',
    )
  }
  // The words are not the contract; the mechanism is. An isotope is the shared
  // Gherkin, and the page has to say so — a word list would pass a page that had
  // stopped meaning it.
  if (!/the isotope is the shared gherkin/i.test(ruleSet)) {
    fail('rules', 'the rule-set page no longer states that the isotope is the shared Gherkin')
  }
  const home = await readText(join(DIST, 'index.html')).catch(() => '')
  if (!/The shared Gherkin/.test(home)) {
    fail('rules', 'the home page no longer renders the shared-Gherkin section')
  }
}

// --- the vocabulary register ---------------------------------------------
// The register is the only place the family's shared words are defined, so the
// build checks that it exists, that it still distinguishes the four senses of
// "isotope", and that every off-shelf pickle is named on it. A debt that is
// recorded in the record but missing from the page is a rule nobody can read.
// PLOT-05 is a constraint recorded ahead of the management layer that will have to
// honour it. If it leaves the page, the next implementation has no callout to read.
const model = await readText(join(DIST, 'docs/data-model/index.html')).catch(() => '')
if (!model.includes('Callout, recorded before it is built')) {
  fail('rules', 'the scope callout has been removed from /docs/data-model')
} else if (!/offline exports/i.test(model) || !/archivability/i.test(model)) {
  fail('rules', 'the scope callout no longer names offline exports and archivability')
}

const vocabulary = await readText(join(DIST, 'docs/vocabulary/index.html')).catch(() => '')
if (!vocabulary) {
  fail('vocabulary', 'dist/docs/vocabulary/index.html is missing — the word register lives there')
} else {
  for (const phrase of ['the measure', 'the spec identity', 'the probe result', 'the procedure page']) {
    if (!vocabulary.includes(phrase)) {
      fail('vocabulary', `the register no longer defines "${phrase}" as a sense of isotope`)
    }
  }
  if (!/pick the shape, not the flavour/i.test(vocabulary)) {
    fail('vocabulary', 'the register no longer cites the shelf rule that names shape rather than flavour')
  }
  const plotSourceForShelf = await readText('src/lib/plot.ts').catch(() => '')
  const offShelf = [...plotSourceForShelf.matchAll(/OFF_SHELF = \[([^\]]*)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((name) => name[1]))
  if (!offShelf.length) fail('vocabulary', 'OFF_SHELF is empty or unreadable')
  for (const name of offShelf) {
    if (!vocabulary.includes(name)) {
      fail('vocabulary', `"${name}" is carried as off-shelf debt but the register does not mention it`)
    }
  }
}

// --- report ---------------------------------------------------------------
if (failures.length) {
  console.error('guard: refused to publish\n')
  for (const { check, detail } of failures) console.error(`  [${check}] ${detail}`)
  console.error('\nNothing was published. Fix the checks above and rebuild.')
  process.exit(1)
}

console.log(`guard: clean — ${notes.join(', ')}`)
