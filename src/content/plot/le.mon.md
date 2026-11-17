---
title: le.mon
description: A set-top display with nothing plugged in — on purpose.
order: 12
updated: 2026-11-16
tags: app, display
seeds: reader, packager
---

# le.mon

A set-top streaming device for macOS, written in Swift, with no dependencies. It is tuned to
nothing, and that is the design: the interface and the display exist before the source does.

Channel 00 is not a placeholder. It is a broadcast test card, a rolling band, snow, a smoked glass
OSD that says `NO SIGNAL` and four dead signal bars. The box, the dial and the OSD are the real
thing; only the transport is missing.

## Why it is on the plot

Because it is the clearest counter-example to the plot's own thesis. Every other row either
documents the lab or runs in it. `le.mon` has no edges: nothing feeds it, and it depends on nothing
here. A map that only drew connected rows would leave it out, and the map would be poorer for it.

## What it provides

A `SourceProvider` contract: a source owns a descriptor the device can display without rendering
anything, plus an off-air state that is honest about having no input. Plugging a transport in
should not require rebuilding the display.

## Where it lives

The source is held locally — there is no published remote as this page is written, which is why the
row's footer says `local only` instead of a link. A link to a repository that does not exist is
worse than no link at all.

## What it costs

- **An interface with no users yet.** The contract has not met a second implementation, so it is a
  hypothesis with a user interface.
- **A macOS-only, no-dependency build.** Swift 6 and Xcode are the platform cost; the release build
  exists because the snow generator is roughly 100× slower unoptimised.
- **A display is a screen people leave on.** An off-air screen that is *designed* to be looked at
  drinks power and attention for nothing.
