---
name: le-plot-content
description: "Use when adding, editing or shipping a page on le.plot — the seed plot: the map of sites grown from le.gume, one page per seed, and the record behind both. Covers src/content/<section>/<slug>.md, the plot record in src/lib/plot.ts and its two-way check, the derived navigation, the publish guard, the offline deck, and the house voice. Trigger on: le.plot, le-plot, add a seed to the plot, edit a plot page, the map, React Flow map, plot record, inherited-page audit, guard failure, deploy le.plot."
---

# le.plot content

`le.plot` is a public site with one job: show every site grown from `le.gume` as entity tables on
one page, and give each one a page you can check. React 19 + Vite + Tailwind v4 + React Flow 13,
Markdown content, derived navigation, GitHub Pages on push.

Repo: `~/projects/personal/le.plot` · Live: https://james-gibson.github.io/le.plot/

## Contract

A change is done when:

1. Any new page is one Markdown file (`src/content/<section>/<slug>.md`) with `title` and
   `description`; `order`, `updated`, `tags`, `seeds` are optional.
2. Any new **seed** has two halves: a record in `src/lib/plot.ts` and a page in
   `src/content/plot/<id>.md`. The record throws at import time if either half is missing, so the
   build is the check.
3. `npm run build` passes and prints `guard: clean`.
4. `npm run smoke` renders every route, including the 404.
5. Copy is dry, specific and cost-first. Every row states what it costs as well as what it buys.

## The sections

| Section | Holds |
| --- | --- |
| `plot` | One page per seed: what it kept, what it added, what it costs |
| `docs` | How the record works, the inherited-page audit, the build, the offline deck |
| `seeds` | The four audiences: reader, grower, maintainer, packager |

Navigation, section indexes, TOC, previous/next, footer columns and page counts are derived from
`src/content/**/*.md`. There is no nav array; a missing page is a wrong folder or broken
frontmatter. A new section is an entry in `SECTIONS` (`src/lib/content.ts`) plus a folder, plus a
label in `scripts/postbuild.mjs` (`LABELS`), or `llms.txt` will label it with its slug.

## The record

`src/lib/plot.ts` is the map's only input. Fields live there, prose lives in Markdown — a page
edit cannot silently change a row. The module checks both directions at import: record without a
page, page without a record. Adding a seed:

```ts
{
  id: 'le.something', entity: 'le.something', title: '…', role: 'child', rung: 2,
  front: '/docs/start', live: 'https://james-gibson.github.io/le.something',
  repo: 'james-gibson/le.something', since: '2026-11-16', inherits: 'le.gume',
  keeps: ['docs'], adds: ['…'], ships: [], vendors: null, note: '…',
  at: { x: 1200, y: 380 },
}
```

`vendors` is the record of a vendored `rules.md` copy: `{ version, overrides }`. Edges are derived
from it — a child with `vendors` gets a second, dashed line. Do not add an edge by hand.

## Assembly

- Markdown only. A live widget is a route in `src/pages/` — `/design` is the catalogue and must
  stay in step with what the site uses; components it does not use are listed under "Left in the
  starter", not shown.
- Router `<Link to>` values are basename-relative; raw `href` strings use
  `import.meta.env.BASE_URL`. Markdown links are root-absolute (`/plot/le.go`) — never write the
  `/le.plot/` mount.
- The map is drawn in the browser only: the prerendered shell carries the table, not the canvas.
  Keep it that way, or a reader without JavaScript gets an empty frame.
- `src/lib/site.ts` is the only place the origin, repo and handoff payload are written. The guard
  fails if a second `Read https://` payload appears.
- Voice: dry, technical, specific. The legume idioms are ordinary English and are never explained.

## Verify

```bash
npm run build   # tsc, vite, deck, prerender, postbuild, doomlint, a11y, contrast, overflow, guard
npm run smoke   # every route rendered server-side
```

The guard checks the output, not the source: route shells, the base path against
`package.json.homepage`, placeholders, leaked paths, links, `llms.txt` coverage, the seed ladder,
the deck's no-script promise, and a sitemap entry per route. A refusal means nothing published —
fix the output, never the check. If a guard rule's subject was deleted, delete the rule and record
why on `/docs/inherited`.

## Child seeds ship back

This seed is a child, and it owes the same thing it documents: an addition other seeds would want
is a candidate **isotope** — a name, slots, presumes, a cost section and an agent prompt — to be
proposed **upstream** to `le.gume`, not left in this fork. A preference local to this repository is
not an isotope; decline it on the page, with the reason. The vendored-rules pattern in
`le.railhead` is the open case named on `/plot/le.railhead` and `/seeds/packager`.

## Publish

Commit locally for "draft", "add", "write". Push to `main` for "publish", "ship", "deploy" — that
is the deploy. Then confirm with a deep link:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://james-gibson.github.io/le.plot/plot/le.railhead/
```
