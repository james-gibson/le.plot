---
title: obsidian
description: A local Markdown vault with plugins — one editor that can open the same files.
order: 24
updated: 2026-11-17
tags: app, editor
seeds: reader
---

# obsidian

A local-first Markdown vault: a folder on disk, a plugin surface, a graph view. It is in the
**reading & writing** layer because it is one of the editors that can open the vault these pages are
written in.

## Why it is on the plot

The plot now names the tooling around the documents, and a map that lists only the tools one person
happens to use is a preference with coordinates. Obsidian is the counter-example: a widely used
editor that is **not** part of the build, and does not need to be.

That is the property worth drawing. The vault is Markdown on disk; the editor is a view. Swapping it
changes nothing that ships.

## What it costs

- **Plugins are the risk.** A vault that needs a community plugin to render is a vault that needs the
  plugin's author to keep working. This site's pages are plain enough that none is required.
- **A second graph.** Obsidian's graph and the plot's graph are different claims — one is links
  between notes, the other is provenance between releases. Do not confuse them.
- **No row-level dependency.** Nothing in the build imports it, so nothing in the build can tell you
  whether it still opens the vault. That is a promise the page makes on the reader's behalf.
