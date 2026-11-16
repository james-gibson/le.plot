# Agent hints

## This repository

`le.plot` is the seed plot: every site grown from `le.gume`, drawn as entity tables on one page.
React 19 + Vite + Tailwind v4 + React Flow 13, Markdown content, derived navigation, a publish
guard, GitHub Pages on push.

Live: https://james-gibson.github.io/le.plot/ · Repo: `james-gibson/le.plot`

## Commands

```bash
npm run dev      # vite
npm run build    # tsc, vite, deck, prerender, postbuild, doomlint, a11y, contrast, overflow, guard
npm run smoke    # render every route (and the 404) to a string
npm run guard    # guard alone, against an existing dist/
```

`npm run build` is the gate. The guard fails on placeholders, leaked absolute paths or
credentials, a base path that disagrees with `package.json.homepage`, a missing route shell,
source maps, a dead Markdown link, content that never reached the bundle, a page missing from
`llms.txt`, or a broken seed ladder. Do not weaken a check to make a build pass; fix the output.
If a rule's subject was deleted, delete the rule and record why on `/docs/inherited`.

## Content

- One page = one file: `src/content/<section>/<slug>.md`, frontmatter `title` + `description`
  (plus optional `order`, `updated`, `tags`, `seeds`). Sections: `plot`, `docs`, `seeds`.
- The nav, section indexes, footer columns, TOC and counts are derived from the file tree. There
  is no nav array. Adding a file is adding a page.
- Markdown only. A live widget is a route under `src/pages/`, like `/design`.
- Router links are basename-relative; raw `href` strings need `import.meta.env.BASE_URL`.
  Markdown links are root-absolute and never include the `/le.plot/` mount.
- Voice: dry, technical, specific. State what a thing costs as well as what it buys. The legume
  idioms ("project seeds", "nuts and bolts", "peas in a pod", "spill the beans") are ordinary
  phrases and are never explained.

## The map

`src/lib/plot.ts` holds one record per seed and is the map's only input: the canvas maps records to
nodes, `PlotTable` maps them to rows, `PlotPanel` maps one to the fields above a plot page.

- Adding a seed means a record **and** `src/content/plot/<id>.md`. The module checks both
  directions at import time, so a missing half fails the build.
- Edges are derived: every child gets an `inherits` line; a child with `vendors` gets a second,
  dashed line carrying its `version`. Never hand-write an edge.
- The canvas is client-only. The prerendered shell carries the table — keep it that way.
- `src/lib/site.ts` is the only place the origin, repo and handoff payload are written. The guard
  fails if a second `Read https://` payload appears in `src/`.

## Design

The map is `@xyflow/react`; motion and buttons are `fancy-ui-react`. Read a component's page
(`https://fancy-ui.rama.app/docs/components/react/<slug>.md`) before using a prop; `className`
exists only where that table lists it. `/design` is the live catalogue of everything the site
ships, and the list of what it deliberately did not.

## Skills

`.opencode/skills/le-plot-content/SKILL.md` — the content workflow (add a page or a seed, verify,
publish).

`.opencode/commands/page.md` — `/page <section>`: one file, guard, smoke, local commit.
`opencode.json` — the schema and an explicit pointer at this file; skills and commands are
discovered from their directories, not listed.
