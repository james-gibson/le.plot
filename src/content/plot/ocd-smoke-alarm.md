---
title: ocd-smoke-alarm
description: Continuous health monitoring for HTTP endpoints — one binary, a triage TUI and a managed service.
order: 9
updated: 2026-11-16
tags: tool, monitoring
seeds: reader, maintainer
---

# ocd-smoke-alarm

Polls configured endpoints on an interval, tracks the state of each one — healthy, degraded,
unhealthy, outage — detects regressions, and emits structured alerts.

The repository is `james-gibson/smoke-alarm`; the binary is `ocd-smoke-alarm`. The plot uses the
binary's name because that is what the lab types and what the other tools call.

## Two modes

- **Foreground.** A Bubble Tea terminal UI for live triage: watch the transition, not just the
  state.
- **Background.** A low-overhead service, started and supervised by [lezz.go](/plot/lezz.go) as a
  LaunchAgent. `lezz demo` runs two instances that monitor each other.

## What it depends on

[isotope](/plot/isotope) for `VerifyTrust`, the wire types and the capability lattice. It is the
monitor's answer to "may this caller read the status it is asking for", which is a different
question from "is the endpoint up".

`adhd` polls this tool and registers with it, so the alarm state has two readers: a human at a
terminal and a dashboard that turns the same state into lights.

## What it costs

- **A monitor that must be up to be trusted.** Two instances that monitor each other is the cheap
  answer to a single point of failure; it is not free, and it does not cover the case where both
  are down for the same reason.
- **A binary with two modes has two configurations.** The TUI and the service do not share a config
  file, so a change has to be made twice and checked twice.
- **No published manual.** The README is the documentation, and it is written for someone who is
  already in the lab.
