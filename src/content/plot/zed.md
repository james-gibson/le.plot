---
title: zed
description: An editor with an agent panel, written in Rust — the other way to open the same files.
order: 25
updated: 2026-11-17
tags: app, editor
seeds: reader, packager
---

# zed

A fast editor written in Rust, with a multi-buffer and an agent panel. It sits in the **reading &
writing** layer next to [opencode](/plot/opencode), because the two are different seats at the same
desk: the harness runs the agent, and the editor is where a person watches and edits.

## Why it is on the plot

Because the agent panel is the interesting part. An editor that can talk to a harness is an editor
whose diff you can see before the build runs — the cheapest possible review, on the same file the
guard will check.

## What it costs

- **A third writer.** The agent, the editor and the person are three editors of one file. Zed's
  answer is a buffer that reloads; the site's answer is still a build that fails.
- **A fast editor is still an application.** The install is small compared to an IDE and large
  compared to `vim`; that is a preference, and the plot records it as one.
- **The panel is not the guard.** A green panel and a clean build are different checks. The second
  one is the one that publishes.

## Not a dependency

Nothing in this repository imports Zed. The row is in the reading layer, not the build layer, and
deleting it would not change a single byte of the output.
