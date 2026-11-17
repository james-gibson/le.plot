---
title: synapse
description: The code-knowledge graph an agent reads instead of grepping — 8585, with a mirror at 8587.
order: 21
updated: 2026-11-17
tags: tool, index, agents
seeds: maintainer, packager
---

# synapse

A persistent code-knowledge graph over the repositories on this machine: indexed search, whole-file
reads, call edges and an index-status surface, served as an MCP service.

It is in the **reading & writing** layer because it is what an agent reads before it writes. The
instruction is blunt: search the graph first, ahead of `grep`, `find` or a file walk.

## Ports and parts

| Port | What answers |
| --- | --- |
| `8585` | the MCP server (HTTP) |
| `8587` | the lab mirror that owns the MCP session and survives a server restart |

The mirror is the row that matters. It keeps the session, queues reads while the upstream is down
and **refuses to queue a mutation** — a proxy that only forwards would turn a restart into a failed
edit. The server itself runs as a Burrito release on the BEAM.

## Status: local only

There is no published source for this row. The service is installed under the user's Application
Support directory, with its index at `~/.synapse-mcp`; the probes that watch it live in the vault.

## What it costs

- **An index can lie about itself.** The vault's own probe records two verified cases where the
  indexer's bookkeeping said `fully_indexed` while the chunk store held a fraction of the chunks —
  `isotope` at 2 chunks, `OpenTTD` at 7,120 of 19,954. A search that trusts the status will report
  a repo as ready and answer from almost nothing.
- **A local service is a local single point.** The mirror is the mitigation; it is also one more
  process to keep alive.
- **A stale index is worse than no index.** The answer is confident and old. The health probe exists
  because "the store is what searches read" is not something the status endpoint can be trusted to
  say.
