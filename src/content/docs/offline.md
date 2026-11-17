---
title: The plot, offline
description: The one-page argument, cut into slides that open from a file:// URL with no network.
order: 4
updated: 2026-11-16
tags: deck, offline
seeds: reader
---

# The plot, offline

Seventeen systems, one plot, drawn as tables. This file is the same argument as the map, cut into
slides and rendered to a single HTML file by the build.
---

## One page, seventeen tables

Every site grown from `le.gume` — and the libraries, tools and sandbox those sites describe — is on
one page, as an entity table with keys and fields. The lines are relationships, not decoration:
solid is inheritance, dashed is a vendored copy of the parent's rules, thin is a claim the row
states.
---

## The starter

`le.gume` is a documentation site that documents itself. Content is Markdown, navigation is derived
from the file tree, the build refuses to publish a contradiction, and the deploy is a push.

- 68 pages
- 7 sections
- 1 guard
- 1 build
---

## The children

- **le.go** — a brick-set manual; every visual decision replaced
- **le.gume-energy** — one home solar system, with a data pipeline and a rung-0 front door
- **le.gume-shell** — the lab, from a shell prompt; all seven sections kept
- **le.railhead** — somebody else's environment, with the parent's rules vendored
- **that-train-dashboard** — a research team's studies, published against le.railhead
---

## Two kinds of line

A solid line says a child was grown from the starter: one parent, many children, keys in both
tables.

A dashed line says the child keeps a copy of the parent's `rules.md`, and carries the version it
was taken at. Same two rows, a second claim about them.
---

## One rule behind

`le.railhead` pins the rules at `29d863e`. That copy has rules one through eight. The parent now
publishes a ninth.

The child's CI runs a catch-up check before the build. Being behind is allowed; being behind
silently is not.
---

## The lab

Eleven rows are not sites: `local-time`, `isotope`, `ocd-smoke-alarm`, `adhd`, `lezz.go`, `le.roy`,
`le.mon`, `openttd`, `lemon-x-files`, `@lemon/extract` and `@lemon/create-ade-stand`. They are the
libraries, tools, packages, display and sandbox the sites describe. Their internal dependencies stay
in each row's `depends` field — drawn, they were a hairball.

## What it costs

- a page per row, and a record beside it
- a check in both directions, so neither half can go missing quietly
- a guard that fails a build rather than a review
- no live query: the plot is a build artifact, not a dashboard
---

## Check it

- Read the map: `/`
- Read the record: `/docs/data-model`
- Read the audit: `/docs/inherited`
- Read a child: `/plot/le.railhead`
