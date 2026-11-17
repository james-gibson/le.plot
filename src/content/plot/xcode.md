---
title: xcode
description: Apple's IDE and toolchain — the one row that exists for a single build.
order: 26
updated: 2026-11-17
tags: app, toolchain
seeds: reader
---

# xcode

Apple's IDE and toolchain. It is in the **reading & writing** layer by courtesy: it does not edit a
Markdown file in this vault. It exists on the plot because it builds [le.mon](/plot/le.mon), the
Swift set-top display.

## Why it is a row rather than a footnote

The plot lists the tools the lab actually uses. `le.mon` is a Swift application with no package
manager and no project file, built with `make` and the Xcode toolchain, and that is a platform cost
the row makes visible: one of the systems on this map needs a specific machine to build.

## What it costs

- **A single-build dependency.** Xcode is a large install for one target. If `le.mon` were removed,
  the correct change would be to delete this row, not to keep it as a habit.
- **A platform, not a tool.** The build assumes macOS and a matching SDK; the README records which
  versions were verified, because "works with Xcode" is not a version.
- **Nothing else needs it.** If a second system starts requiring Xcode, that is a fact about the lab
  worth noticing, and this row is where it would show up first.
