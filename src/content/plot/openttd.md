---
title: openttd
description: The sandbox the train studies run in, pinned as a fork — not a seed, and not a lab tool.
order: 13
updated: 2026-11-16
tags: upstream, simulation
seeds: reader, grower
---

# openttd

A fork of OpenTTD, specified as an **economic regulatory sandbox**: companies, shell corps,
transactions per tick, an ownership graph, a game year that runs to 2983, and a shell-facing API
for the AI that plays it.

It is on the plot because [that-train-dashboard](/plot/that-train-dashboard) runs its studies on
it. The dashboard does not control the environment it studies; it pins a fork, states the pin, and
records what the model can and cannot show. The row is the third party in that sentence.

## What it is not

- **Not a le.gume site.** No Markdown content model, no guard, no derived navigation.
- **Not a lab tool.** Nothing installs it, nothing polls it, and no seed site imports it.
- **Not the game.** The upstream project is OpenTTD; this fork is a specification for using it as a
  research instrument, with interfaces that do not exist upstream.

## What it costs

- **A fork is a maintenance bill with no due date.** Every upstream change is a merge decision, and
  every study's provenance depends on a commit that only this fork has.
- **Economies are models.** A regulatory result from a simulation is a statement about the
  simulation. The dashboard's notes are emphatic about this; the row exists to keep the distinction
  visible.
- **A wide surface.** A shell-facing API on a game server is an execution surface. It is scoped to
  a sandbox on purpose, and it is still a surface.

The repository is `gibsunas/openttd` rather than `james-gibson/openttd` — the fork lives on the
account that runs the simulations.
