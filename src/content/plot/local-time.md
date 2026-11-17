---
title: local-time
description: Temporal universes with addresses you can check — the model two seed sites publish against.
order: 7
updated: 2026-11-16
tags: library, time
seeds: reader, grower
---

# local-time

A TypeScript library for time that belongs to a work rather than to a clock: epochs, keyframes and
cross-universe references, addressed by stable declarative ids.

It is on the plot because two seed sites publish against it. [le.gume-energy](/plot/le.gume-energy)
ships a `Universe`-shaped module (it mirrors the shape rather than taking a runtime dependency);
[le.railhead](/plot/le.railhead) publishes a `/universe` route of the same kind. The difference
matters: a mirror can drift, an import cannot.

## What it provides

- **Epochs.** A universe has a zero, and the zero has a name. Offsets are measured from it, not
  from a calendar, so a fiction and a release schedule can share arithmetic.
- **Keyframes.** Events at a measured offset, with a type. The record is ordered by the work's own
  clock.
- **Cross-universe references.** A work can presuppose another work; the ids are declarative and
  survive a refactor of the files that hold them.

## What it costs

- **A schema in front of the prose.** A page cannot just say "three weeks later"; it has to name
  the keyframe, the epoch and the projection. That is the point, and it is slower to write.
- **Ids are a promise.** A removed id breaks whatever referenced it, so a correction has to
  re-create the id locally rather than delete it. The README says this in the same breath as the
  disclaimers, which is honest.
- **One consumer mirrors it.** [le.gume-energy](/plot/le.gume-energy) copies the shape rather than
  importing the package, so the shape is checked by reading, not by the compiler. That is the
  weakest link in the relation.

## Where it lives

Live docs: `https://james-gibson.github.io/local-time/` — a library's manual, not a le.gume seed.
Source: `github.com/james-gibson/local-time`, since 2025-09-08, which makes it the oldest row on
the plot.
