---
title: that-train-dashboard
description: A research team's dashboard for economic studies run as simulations — the seed that replaced the cast and the components.
order: 6
updated: 2026-11-16
tags: fork, research, openttd
seeds: reader, maintainer
---

# that-train-dashboard

The other seed sites keep the starter's question and change the subject. This one changes the
audience, the sections and the design system, and keeps the contract.

`that-train-dashboard` is the shared record of a small research team that studies economic
questions by running them as OpenTTD simulations. Four sections of its own — `brief`, `notes`,
`ops`, `studies` — none of them the starter's. No `docs`, no `pitch`, no isotope shelf. The
front door is a mission statement: `/brief/mission`.

## What it changed

| Part | Change |
| --- | --- |
| Sections | `brief`, `notes`, `ops`, `studies` — a new cast, not a subset of the starter's |
| Components | 1st-Pouf (claymorphism), owned in `src/components/pouf/`, instead of the starter's library |
| Rules | vendors `rules.md` at `29d863e`, with `RULES-06` overridden |
| Context | publishes its studies against [le.railhead](/plot/le.railhead) |

## One override, with a reason

`RULES-06` says a claim the site makes must be checkable at the URL or in the repository. This
seed replaces it because its run records — the version, seed and scenario behind a study — are
not committed yet, so the build cannot verify them. Provenance is checked by review until the
records exist. That is a weaker guarantee, and the override says so rather than pretending
otherwise.

## What it costs

- **No shared visual vocabulary.** The starter's `/design` page tells you nothing about this site's
  components, and vice versa. Two catalogues to keep honest.
- **A study is only as good as its pinned context.** The team does not control the environment it
  studies; it pins [le.railhead](/plot/le.railhead), and a pin that moves invalidates the comparison.
- **The sandbox is somebody else's code.** The studies run on [openttd](/plot/openttd), a fork
  specified for this purpose. Its economics are the model's, not the world's, and the notes say so.
