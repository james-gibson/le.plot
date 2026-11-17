---
title: adhd
description: Alarm lights in a terminal, and a headless MCP relay in the same binary.
order: 10
updated: 2026-11-16
tags: tool, alarms, mcp
seeds: reader, maintainer
---

# adhd

Two jobs in one binary, and the plot draws neither because both are clients of something else.

**TUI mode** is a small dashboard over one or more [ocd-smoke-alarm](/plot/ocd-smoke-alarm)
instances: colour-coded lights, keyboard navigation, live polling. A light is a state, and the
colour is the whole message.

**Headless mode** is an MCP server that logs all traffic as JSONL, watches the alarm SSE streams,
and joins a prime/prime-plus topology where instances buffer and relay logs to a designated prime.
It registers itself with the monitor as an isotope and advertises `_adhd-isotope._tcp` over mDNS.

## What it depends on

[isotope](/plot/isotope) at `v0.5.0` — two minor versions ahead of the monitor's `v0.3.4`. It also
reads [ocd-smoke-alarm](/plot/ocd-smoke-alarm) over HTTP and SSE; that is a protocol dependency,
not a code one, which is why the two can version independently.

## What it costs

- **Two modes, one identity.** The TUI is a reader and the headless server is a relay with a
  network surface. The binary that shows you lights is also the binary that accepts MCP calls, and
  the plot's own [shell](/plot/le.gume-shell) has a page about what that costs.
- **A relay is a second place logs live.** A prime that buffers is a prime that can lose a buffer;
  the JSONL files are the record and they are on one machine.
- **An mDNS advertisement is a discovery surface.** `_adhd-isotope._tcp` on a shared network tells
  anyone listening what is running and where.
