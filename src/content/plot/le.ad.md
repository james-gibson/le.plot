---
title: le.ad
description: An empty hot desk — the seed whose content is a lease protocol, and a connection point for active seeds.
order: 28
updated: 2026-11-17
tags: desk, lease, isotope, pwa
seeds: reader, maintainer, packager
---

# le.ad

Every other seed on this plot holds content and argues for it. `le.ad` holds none, and that is
the argument: a site can be a **connection point** instead of a library.

It keeps three sections (`desk`, `isotope`, `docs`) and adds a protocol the starter does not
have. Six desks sit on one page, each with a lamp. A seed claims one for a ninety-second lease,
publishes a link that carries the claim, and leaves. When the lease runs out the desk is empty
again — not stale, not held by a seed that stopped calling.

## The protocol is the content

The page is a rendering of `src/lib/desk.ts`, which is a pure state machine: every decision is a
function of `(desk, claim, now)`. A claim is a seed, a surface, a capability rung, a 42i distance
and the moment it was issued. Rung 0 may connect and may not hold; a distance past the rung's
ceiling is refused as drift; a second claim inside the lease is refused as held.

Three artefacts have to agree, and the build refuses to publish if they do not:

| artefact | what it says |
| --- | --- |
| `features/hot-desk.feature` | fourteen scenarios, canon-clean, no background and no tables |
| `scripts/desk-check.ts` | the same fourteen, executed against the implementation |
| `/isotope/hot-desk` | the isotope id the canon derives from the feature |

The rule the 42i lattice did not have is the last one: **silence is not a state.** An expired
lease is swept on read, so a reader can never observe a holder that stopped calling. That is what
separates a connection point from a fact about the last writer.

## Addressable, not just installable

A desk has three addresses, and all three mean *this desk*, not *this claim*:

```text
https://james-gibson.github.io/le.ad/ad/ad-03/
https://james-gibson.github.io/le.ad/#desk=ad-03
web+desk:ad-03
```

The manifest declares `protocol_handlers` for the scheme, `launch_handler: focus-existing` so a
second address reuses the open window instead of spawning a second row, and `handle_links` for
same-origin capture. `focus-existing` only works if the app consumes `launchQueue`, because a
reused window receives the address there and not in `location` — the guard fails the build if the
manifest declares one and the code does not read the other.

Adopting is not claiming. An address aims the claim strip and focuses the seed field; nothing is
taken until a seed is named. A claim link is the other thing: it carries a lease and opens the
desk already held.

## The parts are borrowed, the tokens are owned

The UI takes [tuiparts.sh](https://tuiparts.sh/) at its word — behaviour in typed components,
presentation in source you own — and its `Tokens` contract field for field. tuiparts renders
through OpenTUI, which is terminal-only, so the package itself cannot be a dependency of a
browser build: what is borrowed is the division, the vocabulary and the token names, with the
stylesheet written by hand. There is no CSS framework and no theme runtime.

The palette is measured rather than chosen: steelblue wall, gold grain under the ink, white
smoke, and one sharp hot pink that is only ever a *fill* (2.65:1 on the wall) with near-black text
on it, while the pink that carries meaning as ink is the lighter tint at 4.54:1.

## What it proves

A seed can be a protocol instead of a publication, and the protocol can be small enough to
specify, execute and propose upstream in one sitting. The publish guard carries the claim: the
manifest must describe icons it actually drew, the worker must precache the bundle it shipped
with, and the isotope page must print the id its feature file produces.

## What it costs

- **A page that is empty on purpose.** A reader who wants to learn something has to open the
  docs; the front door is furniture and a form. That is a harder first impression than a pitch.
- **Three ways to say the same thing.** A path, a fragment and a scheme all resolve to one desk,
  and each is a place for the three to disagree. The guard checks the fragment the handler
  produces; it cannot check what a browser does with it.
- **No isotopes shipped back — yet.** `ships` is empty on the map because a proposal is not an
  isotope. The desk-claim feature is filed upstream as
  [isotope#46](https://github.com/james-gibson/isotope/issues/46); until it is adopted, this seed
  is a first home and not a source of truth.
