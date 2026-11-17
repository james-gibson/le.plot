---
title: opencode
description: The agent harness this page was written in — a TUI, a local server and an SDK.
order: 22
updated: 2026-11-17
tags: app, agents, harness
seeds: reader, packager
---

# opencode

The harness that wrote this page. It is in the **reading & writing** layer for a plain reason: the
plot documents itself, and this is the tool that edits the Markdown, runs the guard and reads the
output.

## What it is

A terminal UI, a local HTTP server and an SDK. The TUI is a client of the server; the server
publishes an OpenAPI spec at `/doc`; the SDK and IDE plugins talk to the same surface. Running
`opencode serve` starts the server headless on **port 4096** by default; a TUI started without a
port picks a random one unless you pin it.

## Why a harness is on a map of documentation

Because `llms.txt`, the guard and this plot are written to be operated by an agent. The reader and
the writer are the same seat: an agent reads the built site and edits the source, and the harness is
where both happen.

## What it costs

- **A local server is a local surface.** It binds loopback by default; `OPENCODE_SERVER_PASSWORD`
  exists because loopback is not the same as safe when the machine is shared.
- **A tool that can edit can break.** The publish guard is the answer, not a review step: a page that
  does not build never reaches the deploy.
- **The version is the interface.** The installed harness is `v2.0.26`; its server API and CLI flags
  are versioned, so a pinned workflow is cheaper than a fluent one.
