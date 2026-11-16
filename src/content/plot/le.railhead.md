---
title: le.railhead
description: A record of somebody else's environment, kept to the parent's rules — one rule behind, on the record.
order: 5
updated: 2026-11-16
tags: fork, rules, research
seeds: reader, maintainer, packager
---

# le.railhead

This is the child that treats the parent's rules as a dependency rather than a paragraph.

`le.railhead` records [Railhead](https://github.com/rachittshah/railhead): an environment in which
a language model plays OpenTTD from a shell. It keeps six sections of its own (`arena`, `brief`,
`ops`, `research`, `seeds`, `verify`), publishes no isotopes, and adds a small piece of machinery
the other children do not have: `scripts/sync-upstream.mjs` vendors the parent's `rules.md` at
build time, with a version, a hash and a fetch date.

## The vendored copy

`le.railhead` pins `rules.md` at version `29d863e` and CI runs the fetch with `--check` before the
build. If the parent has published a rule the child has not read, the build refuses to deploy and
names what is missing.

That copy carries `RULES-01` through `RULES-08`. The parent now publishes `RULES-09`, about
measuring an ink as it lands. So the honest row on the map is: **vendored, one rule behind, by
construction** — the catch-up check is the mechanism that makes being behind a visible state
rather than a guess.

## One override, with a reason

The child replaces `RULES-02` on the record. The parent's rule is that navigation is derived from
the content tree. This child adds three live routes (`/universe`, `/known-gaps`, `/design`) whose
content is a module rather than a Markdown file, so the derivation alone no longer covers every
route. Its answer is a declared `EXTRA_ROUTES` list, checked by the guard so each entry gets a
shell and an `llms.txt` line. The override is published at `/rules.md` beside the reason.

## What it proves

Deference can be mechanical. "We follow the parent's rules" is a sentence; a file with a version,
a hash and a CI check is a claim that can fail. The second is worth considerably more, and it costs
one script and one directory.

## What it costs

- **A deploy that can fail because someone else committed.** The catch-up check is deliberately a
  fail, not a warning. That is the trade: freshness over quiet.
- **A copy that drifts.** The vendored file is a snapshot. Until the next `npm run sync`, the
  repository's stated rules are older than the parent's, and the map says so.
- **No isotopes.** The child ships nothing back yet. Its contribution to the starter is the
  vendoring pattern — which is exactly the kind of thing that should be proposed upstream as an
  isotope, and has not been.
