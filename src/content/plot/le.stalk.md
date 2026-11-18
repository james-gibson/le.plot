---
title: le.stalk
description: Collections as predicates, bills of materials in three layers, and lineage as typed edges — the family modelled so a build can disagree with it.
order: 30
updated: 2026-11-18
tags: seed, lineage, collections, bom, isotope
seeds: reader, grower, maintainer, packager
---

# le.stalk

The seed that asks what a collection is. It has no argument about any particular seed: it holds a
**model** of the family — what each seed was cut from, what it carries, what it is made of, and what
it publishes — and renders the model as five pages that a build can check.

Three questions, answered as things that can fail rather than as prose:

## A collection is a predicate with an owner

A folder is where a file is. A collection is an **admission rule**, a **purpose**, an **owner** and
a **snapshot**, and its members are recalculated every build. The pitch (`le.seo`) is the collection
of what can be sold; the map (`le.plot`) owns the registry the others read; the shelf is the
collection of procedures with a carrier. None of them is "all the repositories", because that is a
directory listing with a possessive pronoun.

An empty result is a claim, not a default: a collection that matches nothing stops the build unless
it says it expects to be empty.

## A bill of materials is three layers

Shape (what it was cut from, what it carries), runtime (what has to exist for it to build and
serve), artifacts (what a consumer can fetch). Every entry says where it came from. A layer nobody
published is printed as `unverified`, never omitted — an omitted layer looks exactly like a seed
that has nothing in it.

That is also the finding the seed ships with: ten of eleven seeds cannot state their own runtime
from a published artefact. The fix is a slot in the card (`deps`), not a document.

## Lineage is typed edges, and a graft needs a reason

Six kinds: `cut-from`, `ships`, `composes`, `quotes`, `documents`, `graft`. Four are vertical and
two are horizontal, and direction is always the child, the carrier or the quoting site — never
"related to". An edge that crosses lineage is a graft and must carry a claim, because the child
inherits a shape it did not grow from.

There are zero grafts today. That is a finding about the family, not a gap in the map.

## Mendel tables

A crossing keeps some traits, adds some and loses some. The page records the three crossings this
seed has first-hand knowledge of, including its own: it keeps the guard, drops the framework,
replaces the palette and adds the model. A table that lists only additions is a press release.

The in-universe claim is **mendelbrot**: an isotope is a genotype, a seed is a phenotype, a
collection is a generation, and the rule — declare, derive, refuse — is the same at every zoom.
That is falsifiable, which is the point: a seed that needs a different rule at its own scale is a
break in self-similarity, and the break is worth naming.

## The isotope

It ships `dilly-bean` — a green bean pickled whole and packed upright, the vine's fruit preserved
in the shape it grew: trace a seed's inheritance and its bill of materials. Four slots (`seed`,
`traits`, `layers`, `graft`) and five refusals, executed by `npm run check` against the model and
against deliberately broken fixtures.

## What it proves

A family can describe itself without a document that goes stale. The model is code, the pages are a
function of it, and the numbers on the home page are the numbers the guard measured. It also proves
the starter's shape survives being dropped: there is no framework here, and the guard still holds.

## What it costs

- **A vendored model is a promise to keep it current.** The seed rows are copied from `le.plot` at
  the snapshot date; a new seed is invisible until the file is edited, and the guard cannot tell
  "no new seeds" from "nobody looked".
- **Two cards out of eleven.** The bills are honest but thin, because only two seeds publish a
  description a consumer can read.
- **No rendering gate.** The palette is measured; whether the page reads well is not.
