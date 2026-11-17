---
title: fire-marshall
description: The counter display — the lab's protection catalogue against the state it is actually in.
order: 20
updated: 2026-11-17
tags: tool, lab-safety, dashboard
seeds: maintainer
---

# fire-marshall

The counter display for the lab's protection configurations, and the newest member of the
lab-safety family. A read-only React dashboard that shows what the lab's code *expects* of itself,
protection by protection, and where the configured state sits against that expectation.

It is the **counter display to [adhd](/plot/adhd)'s views**. adhd shows what is happening — lights,
traffic, isotopes. fire-marshall shows the capacity those lights are measured against. A venue's
fire marshal board does not report the show; it counts occupancy against capacity, names the exits
and shows the alarm.

## Status: phase 5

The retrieval passes resolve the catalogue against the [synapse](/plot/synapse) store and the
Qdrant vault; `/changes` diffs against a previous snapshot; the wall, notes and certification views
are in; `/delta` fetches an optional live overlay. The model is still a **build artifact, not a live
probe**: the certification is a claim with a timestamp, not a guarantee.

## What it costs

- **A certificate is not a monitor.** The board can be right about the catalogue and wrong about the
  running lab, because it reads a snapshot. The delta overlay narrows the gap; it does not close it.
- **One process, one machine.** `fire-marshall-serve` owns port `19120` on the loopback interface
  as a lezz service, so the board is exactly as available as the machine it runs on.
- **The address is not published.** The dashboard answers on loopback, which is useful to the person
  at that machine and to nobody else. This page names the port and deliberately does not link the
  address: the publish guard refuses to ship a loopback URL, and a dead link that only resolves on
  the author's laptop is worse than the sentence you are reading.
- **No published source.** The dashboard is held locally. The row says so rather than linking to a
  repository that does not exist.
