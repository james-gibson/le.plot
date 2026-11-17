---
title: "@lemon/create-ade-stand"
description: An Nx workspace from a template in one command — published to abuse the npm create alias.
order: 17
updated: 2026-11-17
tags: package, generator
seeds: grower, packager
---

# @lemon/create-ade-stand

The published name is a trick on purpose: `npm create @lemon/ade-stand` resolves to this package.
The repository is `gibsunas/lemon-ade-stand`, and the package inside it is called
`@lemon/create-ade-stand`.

A run builds a working Nx workspace in one directory that every step agrees on:

```text
${LEMON_X_ROOT}                 default ${TMPDIR:-/tmp}/lemon-x-root
├── nx.json, package.json, ...  the Nx workspace
└── lemon-x-files/              the template checkout
```

1. creates the workspace root, recreating it if this tool created it;
2. clones [`lemon-x-files`](/plot/lemon-x-files) into `<root>/lemon-x-files`, read-only;
3. runs `bin/init.sh` to add the Nx plugins;
4. runs `bin/setup.sh` to generate the packages, apps, libraries and tools, then overlays the
   template's sources.

| Option | |
| --- | --- |
| `-d, --directory DIR` | workspace root |
| `--force` | replace a non-empty root this tool did not create |
| `--prepare-only` | stop after the workspace and template checkout exist |

A run takes an exclusive lock (`<root>.lock`), refuses to replace a non-empty directory that lacks
its `.lemon-x-root` marker, and pins `NX_VERSION` (default `20`) because the generators were
written against it.

## The install path

`install.sh` installs the CLI as a **per-user** service and checks for updates on a schedule. It
refuses to run as root, writes nothing under `/etc` and needs no `sudo` — the previous version did
all three, and the readme says so.

## What it costs

- **It shells out to `git`, `bash`, `npm`/`npx` and `jq`.** A missing one fails mid-run, after the
  workspace has been created.
- **The generated NestJS libraries do not compile yet.** The template adds `"*"` peer ranges that
  resolve to a major the workspace is not on ([#22](https://github.com/gibsunas/lemon-ade-stand/issues/22)).
  Generation succeeds; the scaffold build exits non-zero with a summary.
- **Published and repository versions disagree.** npm carries `0.0.4-78`; the repository's
  `package.json` says `0.2.0`. The row records the package, the page records the gap, and neither
  is a promise about `npm create`.
