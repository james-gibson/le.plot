---
title: The record
description: One TypeScript file is the map's only input, and the pages are prose beside it.
order: 1
updated: 2026-11-16
tags: build, model
seeds: grower, packager
---

# The record

The diagram and the table are the same five objects. So are the five pages under `/plot`.

`src/lib/plot.ts` holds one record per seed: its name, role, readiness, front door, parent, the
sections it keeps, what it added, the isotopes it publishes, the rules copy it vendors, the day its
own history starts, and where its table sits on the map. The canvas maps those records to nodes;
`PlotTable` maps them to rows; `PlotPanel` maps one of them to the fields above a plot page.

## Why the fields are code

Frontmatter would have been the obvious place. It was rejected for two reasons.

1. **The diagram needs types, not strings.** A rung is a number that indexes the shelf; an
   `inherits` field is either a key on the map or null. In frontmatter both are text, and the first
   typo becomes a wrong picture rather than a failed build.
2. **Two sources drift at different speeds.** A page is edited for prose; a field is edited when
   the fact changes. Keeping them in one file means a page edit cannot silently change a row,
   and a row edit is a code review.

The cost is real: adding a seed is a code change, and a TypeScript error is now between you and a
new row. That is the trade this site makes, and it is the same trade the starter makes with its
navigation.

## The check, in both directions

The module throws at import time — which is build time, before the guard runs — when:

- a record has no page at `src/content/plot/<id>.md`, or
- a page in that folder has no record.

One direction catches a node with nowhere to check it. The other catches a page the map cannot
draw. A single loop would have reported whichever mistake it met first and called it done.

## What the record refuses to hold

- **No fetched data.** The plot is not a live GitHub query. A build that needs the network to draw
  a diagram is a build that fails in a train.
- **No layout engine.** Positions are declared in the record. Five nodes do not need a force
  simulation, and a diagram that re-arranges itself is harder to return to than one that does not.
- **No prose.** The record says `rung: 0`; the page says what that costs a homeowner. Mixing them
  would make the map a summary and the page a duplicate.

## Adding a seed

1. Add the record, with a position that does not overlap.
2. Add `src/content/plot/<id>.md` with `title`, `description`, `order` and a body.
3. Say what it kept, what it added, and what it costs in the body. The fields cannot carry the
   argument, and the map should not pretend to.

Then `npm run build`. If either half is missing, the build says which.
