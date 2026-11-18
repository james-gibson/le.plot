#!/usr/bin/env node
/**
 * Post-build steps that GitHub Pages needs and Vite does not know about.
 *
 * 1. dist/404.html — a copy of the shell. Pages serves it for any unknown path,
 *    the SPA boots, React Router renders the 404 route.
 * 2. dist/<section>/<slug>/index.html — one shell per real route. Pages serves
 *    these with a 200 instead of falling through to 404.html, so a deep link is
 *    a found page rather than a missing one that happens to render.
 * 3. dist/.nojekyll — stops Pages from running Jekyll over the output.
 * 4. dist/robots.txt — explicit allow.
 * 5. dist/llms.txt — the machine entry. Generated from the content tree, not
 *    hand-maintained, so an agent that reads it gets the real site.
 */
import { execFileSync } from 'node:child_process'
import { writeFile, mkdir, readdir, readFile, access, rm } from 'node:fs/promises'
import { join, relative } from 'node:path'

const SITE = 'https://james-gibson.github.io/le.plot'
const built = new Date().toISOString().slice(0, 10)
const commit = (() => {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim()
  } catch {
    return built
  }
})()
const DIST = 'dist'
const CONTENT = 'src/content'
const index = join(DIST, 'index.html')

try {
  await access(index)
} catch {
  console.error('postbuild: dist/index.html is missing — run vite build first')
  process.exit(1)
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

// Routes are the content tree plus the two static ones. Keeping this derived
// means a new page gets its own 200 without editing this file.
const sectionDirs = (await readdir(CONTENT, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const routes = [
  'design',
  'palette',
  ...sectionDirs,
  ...(await walk(CONTENT))
    .filter((f) => f.endsWith('.md'))
    .map((f) => relative(CONTENT, f).replace(/\.md$/, '')),
]

// --- prerendered shells ---------------------------------------------------
// `scripts/prerender.tsx` renders every route to static HTML before this runs.
// A shell is the Vite index with its empty #root replaced by that markup, so a
// reader that does not run JavaScript gets the answer and the application
// replaces it on load. AgentReady AR-READ-01 is a MUST for exactly this reason;
// it is also why the build is slower and the output larger.
const template = await readFile(index, 'utf8')
const PRERENDER = join(DIST, '.prerender')
const markup = new Map()
try {
  for (const file of await readdir(PRERENDER)) {
    markup.set(file.replace(/\.html$/, ''), await readFile(join(PRERENDER, file), 'utf8'))
  }
} catch {
  console.warn('postbuild: no prerendered markup — shells will be empty')
}

const shellFor = (key) => {
  const content = markup.get(key)
  return content ? template.replace('<div id="root"></div>', `<div id="root">${content}</div>`) : template
}

// The build knows each page's title; the prerendered shell must say it. An
// effect that sets document.title runs after paint, so without this every page
// ships the same <title> — a WCAG 2.4.2 failure and a bad unfurl.
const pageTitles = new Map()
for (const file of await walk(CONTENT)) {
  if (!file.endsWith('.md')) continue
  const source = await readFile(file, 'utf8')
  const title = /^title:\s*(.+)$/m.exec(source)?.[1]?.trim().replace(/^["']|["']$/g, '')
  if (title) pageTitles.set(relative(CONTENT, file).replace(/\.md$/, ''), title)
}

const titleFor = (route) => {
  if (!route) return null
  if (pageTitles.has(route)) return `${pageTitles.get(route)} · le.plot`
  if (route === 'design') return 'Design · le.plot'
  if (route === 'palette') return 'Colour · le.plot'
  if (route === '404') return 'Not found · le.plot'
  const section = route.split('/')[0]
  if (!route.includes('/') && section) {
    return `${section.charAt(0).toUpperCase()}${section.slice(1)} · le.plot`
  }
  return null
}

const withTitle = (html, route) => {
  const title = titleFor(route)
  if (!title) return html
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
}

for (const route of routes) {
  const dir = join(DIST, route)
  await mkdir(dir, { recursive: true })
  await writeFile(
    join(dir, 'index.html'),
    withTitle(shellFor(route.replace(/\//g, '__')), route),
    'utf8',
  )
}

await writeFile(join(DIST, 'index.html'), shellFor('home'), 'utf8')
await writeFile(join(DIST, '404.html'), withTitle(shellFor('404'), '404'), 'utf8')
await writeFile(join(DIST, '.nojekyll'), '')

// --- sitemap, crawl policy, catalog ---------------------------------------
// The find half of agent readiness: one rule for all agents, a sitemap that
// lists what is published, and a manifest an agent can discover from the head.
const sitemapUrls = ['', ...routes.map((route) => `${route}/`), 'deck.html']
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.map((route) => `  <url><loc>${route ? `${SITE}/${route}` : `${SITE}/`}</loc></url>`),
  '</urlset>',
  '',
].join('\n')
await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8')

await writeFile(
  join(DIST, 'robots.txt'),
  ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE}/sitemap.xml`, ''].join('\n'),
  'utf8',
)

const catalog = {
  name: 'le.plot',
  url: `${SITE}/`,
  description: 'The seed plot: the sites grown from le.gume, and the lab they describe, drawn as entity tables on one page.',
  entries: [
    { type: 'text/plain', url: `${SITE}/llms.txt`, name: 'llms.txt' },
    { type: 'application/xml', url: `${SITE}/sitemap.xml`, name: 'sitemap.xml' },
    { type: 'text/html', url: `${SITE}/`, name: 'the map' },
    { type: 'text/html', url: `${SITE}/docs/data-model/`, name: 'the record' },
    { type: 'text/html', url: `${SITE}/deck.html`, name: 'offline deck' },
  ],
}
await mkdir(join(DIST, '.well-known'), { recursive: true })
await writeFile(join(DIST, '.well-known', 'ai-catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')


await rm(PRERENDER, { recursive: true, force: true })

// --- llms.txt -------------------------------------------------------------
// The site's own answer to "an agent should be able to take it and go": one
// plain-text file listing every page, the build command, and the invariants.
// Generated from the content tree so it cannot drift from the site.
// Labels are presentation; the order and membership come from the files. A new
// section therefore appears here without this map being edited, under its slug.
const LABELS = {
  plot: 'Plot',
  docs: 'Docs',
  seeds: 'Seeds',
}
const SECTION_ORDER = ['plot', 'docs', 'seeds']

function frontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  const data = {}
  if (!match) return data
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':')
    if (at <= 0) continue
    const key = line.slice(0, at).trim()
    data[key] = line
      .slice(at + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
  }
  return data
}

const pages = []
for (const file of await walk(CONTENT)) {
  if (!file.endsWith('.md')) continue
  const route = relative(CONTENT, file).replace(/\.md$/, '')
  const [section] = route.split('/')
  const data = frontmatter(await readFile(file, 'utf8'))
  pages.push({
    route,
    section,
    title: data.title || route,
    description: data.description || '',
    order: Number(data.order ?? 999),
    updated: data.updated || '',
    slots: data.slots || '',
    presumes: data.presumes || '',
  })
}
pages.sort((a, b) => a.section.localeCompare(b.section) || a.order - b.order || a.title.localeCompare(b.title))

// The record is TypeScript; this reads it the way the guard reads the seed
// register — by the shape the file actually keeps — so the machine entry cannot
// state a count the map does not have.
const plotSource = await readFile('src/lib/plot.ts', 'utf8')
const rowCount = (plotSource.match(/^    id: '/gm) ?? []).length
const lineCount =
  (plotSource.match(/^    cuttingFrom: '/gm) ?? []).length +
  (plotSource.match(/^    vendors: \{/gm) ?? []).length +
  (plotSource.match(/^    from: '/gm) ?? []).length

const lines = [
  '# le.plot',
  '',
  '> The seed plot: the lab as lab-safety declares it, and the sites grown from le.gume.',
  `> ${rowCount} tables, ${lineCount} lines, three layers, one page. The record is src/lib/plot.ts.`,
  '',
  `Live: ${SITE}/`,
  'Repo: https://github.com/james-gibson/le.plot',
  'Parent: https://james-gibson.github.io/le.gume/ — cloned from it once, not read by this build.',
  `Rules: ${SITE}/docs/admission (PLOT-01..04, recorded here; the parent's RULES-01..09 apply by reference)`,
  'Admission: PLOT-01. A row is added when the plot can observe the system, not when it exists.',
  '  Provenance is not an admission test: `inherits` records where a deploy was cloned from.',
  'Stack: React 19, Vite, Tailwind CSS v4, React Flow 13, fancy-ui. Static output, no runtime services.',
  'Source of truth: src/content/<section>/<slug>.md — the file path is the URL.',
  '',
  '## Publish',
  '',
  'Push to main. The deploy workflow runs `npm ci && npm run build` and publishes the',
  'result; a local build is optional and runs the same command. A page that is only',
  'being read needs no build at all.',
  '',
  '## Build and verify',
  '',
  '    npm ci',
  '    npm run build    # tsc --noEmit, vite build, route shells, llms.txt, publish guard',
  '    npm run smoke    # renders every route server-side; fails if one throws',
  '',
  'The guard refuses placeholders, absolute local paths, credentials, a base path',
  'that disagrees with package.json homepage, a route without its shell, or a page',
  'that never reached the bundle. A failure means nothing is published.',
  '',
  '## Invariants',
  '',
  '- Navigation, section indexes, table of contents, previous/next and counts are',
  '  derived from the content tree. There is no nav array to edit.',
  '- Router links are basename-relative; raw href strings use import.meta.env.BASE_URL.',
  '- Content is Markdown, never MDX. A live widget is a route under src/pages/.',
  '- /design is the live design system: the same components the site ships.',
  '- This file is generated at build time; editing it in dist/ changes nothing.',
  '',
]

const sectionIds = [...new Set(pages.map((p) => p.section))].sort(
  (a, b) =>
    (SECTION_ORDER.indexOf(a) === -1 ? 99 : SECTION_ORDER.indexOf(a)) -
      (SECTION_ORDER.indexOf(b) === -1 ? 99 : SECTION_ORDER.indexOf(b)) || a.localeCompare(b),
)
for (const id of sectionIds) {
  const list = pages.filter((p) => p.section === id)
  if (!list.length) continue
  lines.push(`## ${LABELS[id] ?? id}`, '')
  for (const page of list) {
    lines.push(`- [${page.title}](${SITE}/${page.route}/): ${page.description}`)
  }
  lines.push('')
}

lines.push(
  '## Isotope shortcuts',
  '',
  'An isotope is a compound: a named procedure with slots — the values it cannot',
  'guess. A QR code carries a shortcut: the isotope URL plus any bound slots.',
  'To resolve one, fetch the page, read its "Agent prompt" block, and ask the user',
  'for every slot whose query-string value is empty.',
  '',
  'A line also carries `presumes:` — the runtime, platform and permissions the',
  'isotope assumes. Compare isotopes on that line before comparing anything else:',
  'the same shape on two eras has two different attack surfaces.',
  '',
)
for (const page of pages.filter((p) => p.section === 'isotopes' && p.slots)) {
  const slots = page.slots || 'none'
  const presumes = page.presumes || 'none'
  lines.push(`- [${page.title}](${SITE}/${page.route}/): slots: ${slots} · presumes: ${presumes}`)
}
lines.push('')

lines.push(
  '## For agents',
  '',
  `- [The map](${SITE}/): twenty-seven entity tables in three layers, one page.`,
  `- [The record](${SITE}/docs/data-model/): the only input the map has.`,
  `- [What this seed inherited](${SITE}/docs/inherited/): the audit, with the deletions and their reasons.`,
  `- [Build and deploy](${SITE}/docs/deploy/): the chain and the checks it runs.`,
  `- [Design](${SITE}/design/): every component in use, live.`,
  `- The offline deck with no application: [the plot, offline](${SITE}/deck.html).`,
  '',
)

await writeFile(join(DIST, 'llms.txt'), lines.join('\n'), 'utf8')

console.log(
  `postbuild: wrote ${routes.length} prerendered shells, 404.html, sitemap.xml, robots.txt, ai-catalog.json, llms.txt (${pages.length} pages)`,
)

// --- feed.xml -------------------------------------------------------------
// A feed is a generated file, not a service. Same content tree as llms.txt, so a
// new page appears in the feed without anyone remembering to add it.
const xml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const newest = pages
  .filter((page) => page.updated)
  .sort((a, b) => b.updated.localeCompare(a.updated))

const feed = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0">',
  '  <channel>',
  '    <title>le.plot</title>',
  `    <link>${SITE}/</link>`,
  '    <description>The seed plot: the sites grown from le.gume, and the lab they describe.</description>',
  '    <language>en</language>',
  ...newest.flatMap((page) => [
    '    <item>',
    `      <title>${xml(page.title)}</title>`,
    `      <link>${SITE}/${page.route}/</link>`,
    `      <guid isPermaLink="true">${SITE}/${page.route}/</guid>`,
    `      <description>${xml(page.description)}</description>`,
    `      <pubDate>${new Date(`${page.updated}T00:00:00Z`).toUTCString()}</pubDate>`,
    '    </item>',
  ]),
  '  </channel>',
  '</rss>',
  '',
].join('\n')
await writeFile(join(DIST, 'feed.xml'), feed, 'utf8')
