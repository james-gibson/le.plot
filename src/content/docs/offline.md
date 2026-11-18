---
title: The plot, offline
description: The one-page argument, cut into slides that open from a file:// URL with no network.
order: 4
updated: 2026-11-16
tags: deck, offline
seeds: reader
---

# The plot, offline

Twenty-nine systems, one plot, drawn as tables. This file is the same argument as the map, cut into
slides and rendered to a single HTML file by the build.
---

## One page, twenty-nine tables

Every site cut from `le.gume` — and the libraries, tools and sandbox those sites describe — is on
one page, as an entity table with keys and fields. The lines are relationships, not decoration:
solid is provenance, dashed is a vendored copy of the starter's rules, thin is a claim the row
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

## The seeds

- **le.go** — a brick-set manual; every visual decision replaced
- **le.gume-energy** — one home solar system, with a data pipeline and a rung-0 front door
- **le.gume-shell** — the lab, from a shell prompt; all seven sections kept
- **le.railhead** — somebody else's environment, with the starter's rules vendored
- **that-train-dashboard** — a research team's studies, published against le.railhead
---

## Two kinds of line

A solid line says a seed was cloned from the starter: one source, many seeds, keys in both
tables.

A dashed line says the seed keeps a copy of the starter's `rules.md`, and carries the version it
was taken at. Same two rows, a second claim about them.
---

## One rule behind

`le.railhead` pins the rules at `29d863e`. That copy has rules one through eight. The starter now
publishes a ninth.

The seed's CI runs a catch-up check before the build. Being behind is allowed; being behind
silently is not.
---

## The lab

Twenty rows are not sites: the lab's libraries, tools, apps and packages, and the six tools that read
and write the documents. Their internal dependencies stay in each row's `depends` field — drawn,
they were a hairball.

---

## Three layers

- **Deployments** — the sites you can open: the starter family and one app.
- **The lab** — what runs on this machine: monitors, dashboards, an index, a sandbox.
- **Reading & writing** — the harness, the editor, the code index.

Toggle a layer to answer one question; **Everything** is all three, which is the view an agent
wants.

---

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
- Read a seed: `/plot/le.railhead`
