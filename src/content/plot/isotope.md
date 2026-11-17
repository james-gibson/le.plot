---
title: isotope
description: A Go library that measures how far a caller has drifted, and what it may still do — the floor under the lab.
order: 8
updated: 2026-11-16
tags: library, trust, protocol
seeds: maintainer, packager
---

# isotope

Not a binary. A shared Go library that answers one question before a tool lets a caller act: how
far has this caller drifted from the level it promised?

The answer is a **42i distance** — a departure from *nominal* measured against *linear time* — and
the distance maps to a rung that limits what the caller may read. One measure, whatever the source:
a stale credential, a clock skew, a tampered receipt, a honeypot contact.

## Why it is on a plot of documentation sites

Because three of the lab's tools import it, and those tools are what the seed sites describe. A
plot that stopped at the sites would show the diagrams and hide the machinery they are diagrams
of.

| Imports it | Version on the record |
| --- | --- |
| [ocd-smoke-alarm](/plot/ocd-smoke-alarm) | `v0.3.4`, in `go.mod` |
| [lezz.go](/plot/lezz.go) | `v0.3.4`, in `go.mod` |
| [adhd](/plot/adhd) | `v0.5.0`, in `go.mod` — two minor versions ahead |

That table is also the cost: three importers, three versions, and no single place that says which
build of the lattice a running tool actually has. `go.mod` is the record, and it is only as current
as the last build.

## What it costs

- **A protocol library is a dependency with opinions.** Every tool that imports it inherits the
  ladder, whether or not its own use case wanted one.
- **The mathematics is the argument.** The lattice is documented in the lab's notes
  (`kb/scripts/lab/PLANE.md`), not on a public site, so a reader of this plot can see the edges and
  not the proof.
- **No live surface.** There is no published manual and no site; `github.com/james-gibson/isotope`
  is the documentation. The row exists so the map does not pretend otherwise.
