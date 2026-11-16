---
title: Build and deploy
description: The chain from a Markdown file to a Pages URL, and the checks that stop it.
order: 3
updated: 2026-11-16
tags: build, pages, guard
seeds: grower, maintainer
---

# Build and deploy

The site is static files on GitHub Pages. There is no server, no database and no runtime service:
the diagram is drawn by the bundle the reader already downloaded, and the data it draws is in the
bundle.

## The chain

`npm run build` is a sequence, and each step exists because the one before it cannot see the next:

| Step | Catches |
| --- | --- |
| `tsc --noEmit` | a prop or record that no longer type-checks |
| `vite build` | the client bundle |
| `node scripts/deck.mjs` | rewrites the offline deck from its Markdown source |
| `vite build --ssr` + prerender | every route rendered to a string, including the 404 |
| `node scripts/postbuild.mjs` | route shells, `404.html`, sitemap, `llms.txt` |
| `doomlint` · `a11y` · `contrast` · `overflow` | markup, accessible names, measured pairs, a 320px sideways scroll |
| `verify-publish` | the output is the shape Pages will serve, and every claim in it resolves |

The order matters. The guard reads `dist/`; it cannot see a page that never rendered, because the
prerender step is what makes the page exist in the output at all.

## What the guard checks here

- required files: `index.html`, `404.html`, `.nojekyll`, `favicon.svg`, `robots.txt`, `llms.txt`
- the application bundle loads, including from `404.html`
- the asset base agrees with `package.json`'s `homepage` (`/le.plot/`)
- no source maps, no `/src/` paths, no placeholders, no absolute home paths, no credentials
- every content route has its own shell, and the page's title is in the bundle
- every Markdown link resolves to a route on this site
- `llms.txt` lists every page
- the seed ladder: ids, rungs in order, entrances resolve, membership exists
- `dist/deck.html` opens without a script and carries a dated commit

Two checks that shipped in the starter are gone: the `examples/` kit and the `bare`/`nojs`
artifacts. Their subjects were deleted, with reasons, on
[what this seed inherited](/docs/inherited). Everything with a subject still runs.

## The map's own check

One thing is checked before the guard: `src/lib/plot.ts` throws at import time if a record has no
page or a page has no record. That is deliberate. A diagram is the easiest thing on a site to let
drift, because a wrong picture still renders.

## Deploy

A push to `main`. The workflow runs `npm ci && npm run build`, and Pages serves `dist/`. Rollback
is `git revert`. The base path is the only environment difference, and the guard is what makes it
a failure instead of a surprise.

Confirm the deploy with a **deep link**, not the home page:

    curl -s -o /dev/null -w '%{http_code}\n' https://james-gibson.github.io/le.plot/plot/le.railhead/

A 200 on `/` proves the deploy ran. A 200 on a nested route proves the shells were written.
