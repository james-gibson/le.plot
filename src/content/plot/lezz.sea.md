---
title: lezz.sea
description: A macOS window on an adhd cluster — the lights, the traffic, the isotopes and the scenarios.
order: 27
updated: 2026-11-17
tags: app, dashboard, macos
seeds: reader, maintainer
---

# lezz.sea

A small macOS app for watching an [adhd](/plot/adhd) cluster, and the newest way to look at the
same information the terminal and the log files already hold.

## What it shows

| Panel | Reads |
| --- | --- |
| **Lights** | `adhd.lights.list` and `adhd.status`, on a configurable interval — green, red, yellow, dark, with the instance name and its 42i rung |
| **Events** | adhd's JSONL MCP traffic, one row per request, response and light update, filterable and searchable |
| **Isotopes** | smoke-alarm's threat × mechanism matrix as a chart of nuclides, with the plain grid one toggle away |
| **Boundaries** | the invariants the app depends on, each with the test that holds it — and two conformance gaps shown as debt, not passes |
| **Scenarios** | smoke-alarm's ready-to-run config catalogue, grouped by theme, with the `lezz run` command and a link to the YAML |

It also discovers: it checks the cluster registry, probes the default adhd endpoint and watches
Bonjour for the isotope advertisement. Drop a `.jsonl` log on the window and it streams; drop a
YAML or JSON config and it adds that cluster.

## Why it is a row and not a screenshot

Because "a terminal is enough" is a claim with a cost, and this is the counter-argument priced
honestly. The lights, the log and the isotope matrix are all readable with `curl` and `jq`. The app
buys a window, a filter box and a menu bar — and charges a platform, a build, and a second place for
the same truth to be rendered.

## What it costs

- **A second client to keep in step.** Every adhd tool name it calls is a contract; when the
  cluster adds one, the window is stale until it is rebuilt.
- **macOS only, Xcode only.** The build is a project file and a toolchain, which is exactly the
  cost [xcode](/plot/xcode) already charges for [le.mon](/plot/le.mon).
- **The isotope chart is a strong claim.** A picture of a threat × mechanism matrix can look like a
  verdict. The panel says which entries are debt and which are tests, because the alternative is a
  dashboard that launders a gap into a green square.
