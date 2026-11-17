---
title: le.go
description: The 42i system introduced through citations — the seed with a completely different visual language.
order: 2
updated: 2026-11-16
tags: fork, design, citations
seeds: reader
---

# le.go

Of the five children, this one looks least like its parent — and that is the point it makes.

`le.go` takes the content model, keeps three sections (`docs`, `isotopes`, `seeds`), and throws
out the rest of the visual layer. In its place: a brick-set manual. Four colours, a numbered
parts list, a projector route, a draft route, a philosophy route. The typography is not the
starter's, the components are not the starter's (`lucide-react` instead of the fancy-ui kit), and
the pages still satisfy the same content contract.

## What it changed

- **Sections:** kept `docs`, `isotopes`, `seeds`; dropped the four that were the starter's own
  argument.
- **The design language:** a brick metaphor, with its own components and a four-colour palette.
  Nothing in the starter's palette survives.
- **Three live routes:** `/philosophy`, `/projector`, `/draft` — pages that are modules rather
  than Markdown.
- **One isotope:** `silverskin`, the same minimal documentation site the starter publishes.

## What it proves

A seed is not a theme. The parts that carry over are the ones with a reason to: the file-is-the-page
model, the derived navigation, the guard. A child can replace every visual decision and still be
the same kind of object — which is the difference between a seed and a template pack.

## What it costs

- **Two vocabularies.** The starter's design page and this one have almost nothing in common, so
  a change to the shared model has to be re-read in a language you did not write.
- **No vendored rules copy.** `le.go` defers to the parent without pinning a version, so there is
  no mechanical answer to "which rules was this built against". The other two children that vendor
  rules do answer it; this one answers with prose.
- **Three live routes are three things the guard has to learn.** The content tree no longer lists
  every route, so `llms.txt` and the shells have to be taught about them by hand.

The honest summary: it is the most expensive child to keep in step and the best evidence that the
inheritance is structural rather than cosmetic.
