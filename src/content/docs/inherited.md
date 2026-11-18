---
title: What this seed inherited
description: The inherited-page audit, run on the record — what was kept, what was deleted, and what it cost.
order: 2
updated: 2026-11-16
tags: audit, fork
seeds: maintainer
---

# What this seed inherited

An inherited page compiles. That is the whole problem: the build proves the markup parses, not
that the page is true of this repository. The starter's own guidance is to audit every inherited
page before writing anything new, so this page is the audit, as a receipt.

## Kept, because it can be re-derived here

| Kept | The check it answers |
| --- | --- |
| `src/lib/content.ts` | Every page on this site is a file in `src/content/`; navigation is derived, and it is |
| `src/lib/markdown.tsx` | The article voice is the site's voice — one h1, headings from `##` |
| `scripts/verify-publish.mjs` | The guard runs in this build and fails it; the checks below are the ones it keeps |
| `scripts/postbuild.mjs` | Every route has its own shell, and `llms.txt` lists every page |
| `.github/workflows/deploy.yml` | The deploy really is a push to `main` |
| The palette | Nine tokens, measured on [/palette](/palette) |
| The file view | It shows a page as the file it is, which is the site's own claim about itself |

The HTML 2.0 switch was kept too, for the same reason the map exists: it is a claim you can test in
a browser rather than believe in a paragraph.

## Deleted, because it was the starter's argument

| Deleted | Why |
| --- | --- |
| `src/content/factors/` | Twelve-factor essays about *that* site's decisions; this site applies none of the twelve to itself |
| `src/content/guides/` | Task walkthroughs for adding pages to the starter; the plot has its own four steps |
| `src/content/isotopes/` | This repository ships no isotopes, so a page describing them would describe nothing here |
| `src/content/pitch/`, `src/content/writing/` | The commercial case for a documentation site is not the case for a map |
| The seed cast | The audiences here are readers, growers, maintainers and packagers — not buyers and editors |
| `examples/cornichon/` | The spell-check kit the parent documents; nothing in this repository runs it |
| `public/bare/`, `public/nojs/` | The no-stylesheet and no-script artifacts, and the two seeds that pointed at them |
| `rules.md` | Not republished here — see below |

Deleting a page is not the same as deleting a check. The guard's `examples` and `satire` rules were
removed **because the artifacts they guarded were deleted**; every check that still has a subject
still runs. A guard rule with nothing left to check is a green light with no wire.

## `rules.md` is not published, and the rule is not the parent's

The parent publishes nine rules at `/rules.md`, generated from its own guard. Two children vendor
that file with a version and a hash, and pay for it with a CI catch-up step. This site does
neither: it links the parent's copy and publishes no rules file at all — a leaf has no child to
defer to one, and the guard refuses the file rather than let the role be invented.

The plot does have a rule of its own, and it lives where a leaf can keep one: the page
[When a row is added](/docs/admission). `PLOT-01` is the admission test, `PLOT-02..04` are the
properties the build checks at import time, and the guard refuses a build where the rule's
sentence has gone missing. The parent's nine still apply by reference; the plot's one is its own.

## What the plot does not depend on

`inherits` on a row records where the deploy was cloned from, once. It is not a dependency, and
the build enforces the reading:

- nothing here reads `le.gume` at build time or at run time;
- the parent's rules are linked, not vendored, so there is no version to drift out of date;
- deleting the solid edge would change the picture, not break the build.

That is why "grown from the seed" is not on its own a reason for a row. The admission rule is
[PLOT-01](/docs/admission), and it asks what the plot can *observe* — a peer lab-safety names, a
published deployment, or a tool that reads and writes the documentation.

## What the audit cost

- **Nine pages of argument, gone.** The plot is smaller than the starter and has less to teach per
  page. That is the intended trade, not a bug.
- **The guard is now this repository's, not the parent's.** Removing the two rules was a decision
  with a reason, and the next child inherits the decision rather than the original file. If the
  parent ships a new check, this repository has to choose it deliberately.
- **One inherited failure remains reachable.** The parent's guard cannot tell whether a page is
  true; it can only tell whether the page reached the build. Every row on this plot is a page that
  has to be re-read when the seed it describes changes.
