# le.plot

The seed plot: the cuttings taken from [`le.gume`](https://james-gibson.github.io/le.gume/), and the lab
they describe, drawn as entity tables on one page. Twenty-nine tables, twenty-three lines, and a page you can
check behind every row.

<p align="center">
  <a href="https://github.com/james-gibson/le.plot/actions/workflows/deploy.yml"><img src="https://shieldcn.dev/github/ci/james-gibson/le.plot.svg?workflow=deploy.yml&branch=main&variant=secondary" alt="deploy" /></a>
  <a href="https://github.com/james-gibson/le.plot/blob/main/LICENSE"><img src="https://shieldcn.dev/github/license/james-gibson/le.plot.svg?variant=secondary" alt="license" /></a>
  <a href="https://github.com/james-gibson/le.plot/commits/main"><img src="https://shieldcn.dev/github/last-commit/james-gibson/le.plot.svg?variant=secondary" alt="last commit" /></a>
</p>

**Live:** https://james-gibson.github.io/le.plot/

## What this is

A seed grown from a seed. The starter argues that a documentation site is a file tree with a guard;
this repository tests the claim by being one of eight cuttings. It keeps the content model, the guard and the
deploy, adds [React Flow](https://reactflow.dev), and changes the subject to the family itself —
plus the twenty-one libraries, tools, packages, apps and sandbox the systems describe.

- **One page, three layers.** The map is twenty-nine entity tables and twenty-three lines: solid for provenance, dashed
  for a vendored copy of the starter's `rules.md`, thin for a cross claim. The lab's internal
  dependencies stay in each row's `depends` field — drawn, they were a hairball.
- **The shared Gherkin.** An isotope is what travels between seeds: a named procedure, a written
  spec, and the slots it cannot guess. `ISOTOPES` is a record, `ships` must resolve to it, and the
  home page prints each pickle with the seeds that carry it — proliferation as a table rather than
  a claim.
- **One record.** `src/lib/plot.ts` is the map's only input. The canvas, the tables and the
  twenty-nine pages under `/plot` are three renderings of the same objects.
- **A check in both directions.** A record with no page, or a page with no record, throws at import
  time — so the build fails before the guard runs.
- **A table for every reader.** The prerender ships the table, not a canvas; without JavaScript
  the values are still there.
- **An audit on the record.** `/docs/inherited` lists what was kept, what was deleted, and why —
  including the two guard rules whose subjects were deleted.

## Quickstart

```bash
git clone https://github.com/james-gibson/le.plot my-site
cd my-site
npm install
npm run dev
```

Node 22+. Nothing else is required.

## Layout

```text
src/content/<section>/<slug>.md   pages (frontmatter: title, description, order, updated, tags, seeds)
src/lib/content.ts                the content model: glob, ordering, headings, neighbours
src/lib/plot.ts                   the records; the map's only input, checked two ways
src/components/PlotCanvas.tsx     React Flow: nodes, edges, crow's-foot markers, the inspector
src/components/PlotNode.tsx       one seed as a table node
src/components/PlotTable.tsx      the same rows as two tables, server-rendered
src/pages/Design.tsx              the live design system
scripts/postbuild.mjs             per-route shells, 404.html, sitemap, llms.txt, feed.xml
scripts/verify-publish.mjs        the publish guard
scripts/deck.mjs                  the offline deck, built from src/content/docs/offline.md
.github/workflows/deploy.yml      GitHub Pages on push
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc`, Vite, deck, prerender, postbuild, doomlint, a11y, contrast, overflow, guard |
| `npm run smoke` | Renders every route to a string; fails on a render error |
| `npm run guard` | The guard alone, against an existing `dist/` |
| `npm run preview` | Serve the production build locally |

## Adding a seed

Two halves, one commit:

1. a record in `src/lib/plot.ts` (`id`, `rung`, `front`, `live`, `cuttingFrom`, `since`, `at`, …);
2. a page at `src/content/plot/<id>.md`.

Then `npm run build`. Missing either half is a failed import, not a warning.

## Deploy

Push to `main`. The workflow runs `npm ci && npm run build`, uploads `dist/`, and publishes with
`actions/deploy-pages`. The Pages base path lives in `vite.config.ts` (`base`) and
`package.json` (`homepage`); the guard fails when they disagree.

## License

AGPL-3.0-only. The source is public; if you run a modified version as a network service, publish
your changes.
