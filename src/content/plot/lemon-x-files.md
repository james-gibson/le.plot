---
title: lemon-x-files
description: The start agents and CI install instead of writing a workspace — the Nx template, its scripts, and spawn.json.
order: 15
updated: 2026-11-17
tags: template, nx
seeds: grower, packager
---

# lemon-x-files

A template checkout, not a running project. It carries the two scripts (`init.sh`, `setup.sh`), the
generator definitions and the package families that a generated lemon workspace is built from:

| Family | Packages |
| --- | --- |
| frameworks | `x-nestjs`, `x-prisma` |
| ui | `x-uikit`, `x-emberdeck` |
| data | `x-energy` |
| utilities | `x-utils`, plus `tools/editor` and `tools/github` |

`@lemon/create-ade-stand` clones this repository into `<workspace>/lemon-x-files`, runs the two
scripts against it and overlays the result. The clone is read-only: the generator never pushes,
and the template never learns what was generated.

## The start, and the slots

Waiting agents do not have to write a workspace: they clone this repository, run the two scripts and
overlay. What they do need is the small set of facts nobody can infer, and since 2026-11-17 that is
`spawn.json` — seven slots with defaults, written once to `seed.json`, and a plan with three parallel
branches (start, content, publish) that converge. Each branch ends in a check and a failure the agent
provokes on purpose, because a check that has never gone red is a sentence.

The slot that carries the most weight is `checks`: a workspace claims only what it will run, and
records what it did not claim. Forcing every rule into a small space would remove the one thing this
repository is actually good for — showing a builder what breaking a rule looks like.

## What it costs

- **A template is a moving dependency.** A generator that clones `main` produces a different
  workspace next month. The ade-stand pins the Nx version (`20`) but not this checkout, so the
  generated project's shape is only as stable as the template's default branch.
- **The packages are sources, not releases.** They are overlaid into the new workspace and then
  owned there. Fixing a template bug helps the next project and does nothing for the last one.
- **No published surface.** There is no site, no npm package and no port: the repository is the
  artefact, and the row exists because the generator's output would be unexplainable without it.
