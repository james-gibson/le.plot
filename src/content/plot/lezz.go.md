---
title: lezz.go
description: The orchestrator that installs, updates and demonstrates the lab — the only row whose job is the other rows.
order: 11
updated: 2026-11-16
tags: tool, orchestration
seeds: grower, maintainer
---

# lezz.go

One command for the local cluster: installs and updates the monitor and the dashboard, downloads
the protocol binary's consumers, keeps the tools current, and starts a demo cluster that has
nothing in it yet.

The plot has no edge drawn from `lezz.go` to the tools it manages. Ten or so lines around seven
nodes made a hairball, so the relationship lives in this row's `depends` field and in the
paragraphs below. That is a drawing decision, not a claim that the dependency is soft.

## What it depends on

| Row | How |
| --- | --- |
| [isotope](/plot/isotope) | `v0.3.4` in `go.mod` |
| [ocd-smoke-alarm](/plot/ocd-smoke-alarm) | `v0.11.0` in `go.mod`; started as a LaunchAgent |
| [adhd](/plot/adhd) | launched as a child process; its MCP tools are proxied through the app |

## The demo cluster

`lezz demo` starts a self-contained cluster in the foreground; `lezz demo start|stop|status` runs
it detached with stable ports. `lezz prod --isotope NAME` runs two logical alarms with a fallback,
three nodes, and a SIGHUP rotation as a launchd service. `lezz auto` starts a base cluster that is
empty and awaiting, reusing an existing registry.

## What it costs

- **An installer is a supply chain.** `lezz update` downloads binaries and runs them; the trust
  model is the release host and the checksum, and the plot's shell site spends a page on that.
- **Stable ports are a small protocol.** `demo` promises the same ports each time so a dashboard can
  find the cluster; a second cluster on the same machine has to negotiate, and the failure is a
  port collision at the worst moment.
- **A supervisor that is also a user interface.** The tool that starts the tools is also the tool
  you talk to about them, so a bug in the orchestrator looks like a bug in everything.
