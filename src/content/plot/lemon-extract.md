---
title: "@lemon/extract"
description: A CLI that reads a TypeScript monorepo's tsconfigs and reports what each one includes.
order: 16
updated: 2026-11-17
tags: package, typescript
seeds: grower
---

# @lemon/extract

A published npm package (`@lemon/extract@0.2.11`) for one problem: a monorepo with hundreds of
`tsconfig` files is slow to start, and some of them are misconfigured in ways that only show up as
a cold-start delay or an out-of-memory failure in CI.

Run it in a repository:

```sh
npx @lemon/extract
```

## What the published tool does

- identifies every unique `tsconfig` naming convention and counts how many files use each;
- counts and summarises the files a particular `tsconfig` includes.

That is the whole of 0.2.11. It assumes `tsc` is available globally, and it reads configs rather
than changing them — the report is the product.

## Two READMEs, one package

The repository at `gibsunas/lemon-extract` now describes a much larger plan: a self-configuring
tool that scans deployments, finds projects on a retired dependency version and opens the pull
requests to fix them. That is **not** in the published package; the last npm publish is from 2022,
and the newest copy on npm still counts tsconfigs.

The row records the package that exists. The plan is worth reading on GitHub, and it is not what
`npx @lemon/extract` does today.

## What it costs

- **A stale publish.** The package has not changed since 2022 while its repository has a newer
  ambition. `npx` gets the old behaviour, so the README on npm is the honest one.
- **A global assumption.** It needs `tsc` on `PATH`; in a container that only pins the local
  compiler, it fails before it reports anything.
- **A report, not a repair.** Finding the misconfigured config is the cheap half; deciding which
  project owns the fix is the work it leaves to you.
