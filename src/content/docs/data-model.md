---
title: The record
description: One TypeScript file is the map's only input, the pages are prose beside it, and the lines are derived.
order: 1
updated: 2026-11-16
tags: build, model
seeds: grower, packager
---

# The record

The diagram and the tables are the same twenty-six objects. So are the twenty-six pages under `/plot`.

`src/lib/plot.ts` holds one record per row, in two shapes:

- **a seed row** — a site grown from the starter: name, role, readiness, front door, parent, the
  sections it keeps, what it added, the isotopes it publishes, the rules copy it vendors, the day
  its own history starts, and where its table sits on the map;
- **a part row** — a library, tool, app or upstream: name, kind, language, what it provides, what it
  depends on, the default ports it binds when it binds any, and the same position and history.
  Its kind is one of library, tool, app, upstream, package or workspace.

One file, two shapes, because they answer different questions. A seed row answers "who is this
for"; a part row answers "what does this do". Forcing one shape would have meant a `rung` of
`undefined` on nineteen rows, or a `kind` on seven rows that does not apply.

## Why the fields are code

Frontmatter would have been the obvious place. It was rejected for two reasons.

1. **The diagram needs types, not strings.** A rung is a number that indexes the shelf; `inherits`
   is either a key on the map or null. In frontmatter both are text, and the first typo becomes a
   wrong picture rather than a failed build.
2. **Two sources drift at different speeds.** A page is edited for prose; a field is edited when
   the fact changes. Keeping them in one file means a page edit cannot silently change a row, and
   a row edit is a code review.

## Ports are defaults, not reservations

A part row may carry `ports`: the port it binds when nothing overrides it, and what answers there.
The panel prints the purpose beside each number, because `8088` on its own is a rumour.

It is an optional field on purpose. A library, an app with no network surface and a static site
have no ports, and "0" would be a lie about a service that never opens a socket. Omitted means
omitted.

The field is also not a reservation. Every default below is read from the repository — a config
file, a flag or a second cluster can move it — and the page says so rather than implying a
guarantee.

## Three layers, one geography

Every record carries a `group`: `examples` (a deployment you can open), `lab` (something that runs
on this machine), or `docs` (a tool that reads or writes the documents). The map's switches filter
on that field; a view is the rows whose group is switched on, and a line is drawn only when both of
its ends are.

The geography does not move between views. A record has one `at` position, and toggling a layer
fits the viewport to what remains rather than re-laying the map out — the row you found yesterday is
in the same place today, which is the only property that makes return visits cheap.

A row belongs to exactly one group. If a future row answers two questions, give it a primary group
and say the second in its page; a node in two layers is a row nobody can find twice.

## The lines are derived

Nothing about an edge is hand-written in the drawing code.

| Line | Comes from |
| --- | --- |
| solid, bar and crow's foot | every row with `role: 'seed'` gets one `inherits` edge to its parent |
| dashed | a seed whose `vendors` is not null gets a second edge, carrying the version |
| thin | `RELATIONS`, a short list of cross claims with a verb each |

The lab's internal dependencies — isotope under three tools, `lezz.go` installing them — are in
each part's `depends` field and **not** drawn. That was a decision made after trying it: ten more
lines between seven nodes produced a diagram you could not read at any zoom that also let you read
the tables. A row is a better place for a dependency list than a line is.

## The checks, in both directions

The module throws at import time — build time, before the guard runs — when:

- a record has no page at `src/content/plot/<id>.md`;
- a page in that folder has no record;
- a relation names a row the map does not hold.

The first direction catches a node with nowhere to check it; the second catches a page the map
cannot draw; the third catches a line to nowhere. A single loop would have reported whichever
mistake it met first and called it done.

## What the record refuses to hold

- **No fetched data.** The plot is not a live GitHub query. A build that needs the network to draw
  a diagram is a build that fails in a train.
- **No layout engine.** Positions are declared in the record. Twenty-six nodes do not need a force
  simulation, and a diagram that re-arranges itself is harder to return to than one that does not.
- **No prose.** The record says `rung: 0`; the page says what that costs a homeowner. Mixing them
  would make the map a summary and the page a duplicate.

## Adding a row

1. Add the record, with a position that does not overlap an existing table.
2. Add `src/content/plot/<id>.md` with `title`, `description`, `order` and a body.
3. Say what it kept, what it added and what it costs in the body. The fields cannot carry the
   argument, and the map should not pretend to.

Then `npm run build`. If either half is missing, the build says which.
