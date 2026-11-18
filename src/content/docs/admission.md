---
title: When a row is added
description: The plot's admission rule — what it observes, the evidence a row needs, and why provenance is not one.
order: 5
updated: 2026-11-17
tags: rule, admission, plot
seeds: maintainer
---

# When a row is added

The plot has one rule, and it is this repository's rule — not the starter's. It is recorded here
as `PLOT-01` and enforced in the build, and this page is the reasoning behind it.

It is **not** published as a `rules.md`. The starter publishes rules because seeds defer to them;
this seed is a leaf, and a rule file here would be a second source of truth with no one to check it. A page that the guard refuses to let disappear is the leaf's equivalent, and it
costs one string in `scripts/verify-publish.mjs`.

**A row is added when the plot can observe the system, not when the system exists.**

## What the plot observes

The subject is the lab, taken from the one register that already says what the lab is: the peers
[lab-safety](https://github.com/james-gibson/lab-safety) names and keeps sheets for. The sites
deployed from the starter and the tools that read and write the documentation are the other two
layers because a reader arriving at the plot needs them to make sense of the lab — not because the
map is a catalogue of repositories.

| layer | admitted when | the evidence | what it answers |
| --- | --- | --- | --- |
| `lab` | lab-safety names it as a lab tool, or keeps a sheet for it | a `### name — description` section in lab-safety's README, or `sheets/<name>.md` | what runs, and who checks it |
| `examples` | it is published, and it is a cutting taken from the starter | an origin you can open, and a build whose guard you can read | what was cut from the starter |
| `docs` | it reads or writes the documentation | it edits the vault, or indexes it, or serves it | how the documentation is read and written |

A row belongs to exactly one layer. A system that fits two is described by its strongest claim:
`lab-safety` is on the map as a lab tool, not as a deployment, even though it has a README.

## Provenance is not an admission test

Each seed row carries `cuttingFrom`, and the map draws it as a solid line from the starter. That line
is **where the deploy was cloned from**, once. It is not a dependency:

- nothing in this repository reads `le.gume` at build time or at run time;
- the starter's rules are linked, not vendored, so the link cannot silently stale;
- deleting the solid edge would change the picture, not break the build.

So "it was cloned from the starter" is not a reason for a row. `le.ad` is on the plot because it is
published and checkable at an origin, which is the `examples` clause; being cut from the starter
is how it got there, not why it is admitted. A clone with no published surface is a repository,
and the plot does not hold repositories.

## What is refused

A row is refused, or demoted to a link in prose, when:

- **it is a dependency.** A library that three rows import belongs in those rows' `depends`, not
  as a fourth table. The map already refuses to draw that graph; the rule refuses the table.
- **it is a proposal.** A feature not yet adopted is a `ships` entry or a `RELATIONS` verb, not a
  row. `le.ad` proposes the desk-claim isotope to `isotope` without being a row for the proposal.
- **it has no runnable or published surface.** A design document, a plan, a repository of notes.
- **the observatory does not name it.** Enthusiasm is not evidence. If lab-safety's register has
  never heard of it, the `lab` clause does not apply, and a deployment has to qualify on its own.

## The audit, as a receipt

lab-safety's register names eight peers. Five were on the plot before this page existed:

| peer | on the plot | note |
| --- | --- | --- |
| lezz.go | yes | the host |
| ocd-smoke-alarm | yes | the monitor |
| adhd | yes | the dashboard |
| tuner | **no** | the broadcaster — named by lab-safety, absent here |
| isotope | yes | the protocol |
| pickled-onions | **no** | the chronicler — named by lab-safety, absent here |
| lab-safety | **no** | the observatory itself — named by lab-safety, absent here |
| fire-marshall | yes | the counter display |

That table is the rule doing its job: three peers are named by the register the plot claims to
observe, and three tables are missing. Filing them is the next act; amending the rule to admit them
is not necessary, because they already qualify.

## The mechanical half

Half the rule is a judgement and half is arithmetic, and the arithmetic runs in the build:

- a row with no page, or a page with no row, throws at import time — before the guard;
- two rows on one coordinate is a map nobody can read, and it throws too;
- a `seed` row must be `live` on https with a front door that starts at `/`;
- a `part` row must say what it `provides`;
- the rule itself must stay on the published page. The guard greps for the sentence and for the
  provenance clause, so deleting the rule fails the build instead of quietly freeing the map;
- no `rules.md` may appear. A leaf that publishes rules has invented a role it does not have, and
  the guard refuses the file.

What the build cannot check is whether the evidence is real. That is why the evidence is a field:
"lab-safety names it" and "you can open it" are sentences a reader can falsify in a minute, which
is the most a build can ask of them.
