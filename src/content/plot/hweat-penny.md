---
title: hweat-penny
description: One penny, one rotation, counted — the single-page explainer the lab calls le.hweat-penny.
order: 19
updated: 2026-11-17
tags: app, explainer
seeds: reader
---

# Hwheat Penny

The lab calls it `le.hweat-penny`; the repository does not. The page is **Hwheat Penny** — *a
wheat penny, pronounced with the h* — and it does one thing: it explains a penny, a rotation and
an isotope in a single screen, then lets you spend one.

## What it is

A Vite + React single-page app, not a content site. There is no Markdown tree, no derived
navigation and no publish guard beyond its own post-build. It is a **deployment example**, which is
why it sits in that layer of the map even though it is not a seed.

It has a voice — the page can read itself aloud — and a counter that counts rotations the way the
lab does: one penny per rotation, never a subscription.

## Why it is on the plot

Because the plot's deployment layer should show the shape of what gets deployed, not only the
canonical shape. `hweat-penny` is what a seed looks like when the answer is one page and the
question is "what is this penny", with the content model removed rather than replaced.

## What it costs

- **No content model.** Every word is in a component, so a text edit is a code edit and a
  translator has nothing to translate.
- **A voice is an accessibility surface.** Reading the page aloud is good for one reader and
  hostile to another; the control is visible and off by default, and that is the whole mitigation.
- **It is a single page, permanently.** Adding a second page means either inventing a content tree
  (becoming a seed) or duplicating the app shell. The row exists so that trade is visible before
  someone makes it again.
