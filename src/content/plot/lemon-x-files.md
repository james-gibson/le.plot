---
title: lemon-x-files
description: The Nx workspace template the ade-stand clones — packages, tools and the two scripts that build a workspace.
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

## What it costs

- **A template is a moving dependency.** A generator that clones `main` produces a different
  workspace next month. The ade-stand pins the Nx version (`20`) but not this checkout, so the
  generated project's shape is only as stable as the template's default branch.
- **The packages are sources, not releases.** They are overlaid into the new workspace and then
  owned there. Fixing a template bug helps the next project and does nothing for the last one.
- **No published surface.** There is no site, no npm package and no port: the repository is the
  artefact, and the row exists because the generator's output would be unexplainable without it.
