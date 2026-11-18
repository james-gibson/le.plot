---
title: The rules are the rules in the Go programs
description: le.gume documents the internals of the lab-safety ecosystem — the same rules the binaries enforce, the same arithmetic, rendered as sites.
order: 6
updated: 2026-11-17
tags: rule, math, lab-safety, provenance
seeds: maintainer, packager
---

# The rules are the rules in the Go programs

`le.gume` did not set out to be a documentation framework. It set out to **document the internals of
the lab-safety ecosystem** — the peers, the trust protocol, the alarm paths — and the framework is
what that job turned out to need. Every site in this family is a sprout of that job, and the thing
that makes them a family rather than seven copies is that they share their written behaviour.

The claim that makes it more than a family resemblance is narrow and testable: **the rules a page
states are the rules the Go programs enforce, and the math is the same math.** A page that
disagrees with a binary is a failing test, not a stale sentence — that is the whole reason
lab-safety writes its safety data sheets as Gherkin and has them canonicalized into isotope ids.

## What grows, and what propagates

The words are not the point; the growth is. A **seed** sprouts a site: one repository becomes one
origin a reader can open. An **isotope** sprouts across seeds: a named procedure, a written
specification, and the slots it cannot guess, carried by any seed that wants the behaviour. The
first kind of growth is a deploy. The second is how the family proliferates without anyone
re-inventing a spell check, a rotation handshake or a blast-radius measurement.

**The isotope is the shared Gherkin.** That is the mechanism, and it is why the same behaviour
turns up in several sites without being copied: `silverskin` and `cornichon` travel from the
starter, `dill`, `gherkin` and `piccalilli` from the shell, and each name resolves to a page whose
spec is the artifact. A map that showed only repositories would miss the thing that actually
moves between them — which is why [the shared Gherkin](/#shared-gherkin) is a section of its own
and why an unknown pickle fails the build.

## The shape is not the core

`le.gume` is the **shape** of the system: a Markdown content model, a derived navigation, a guard,
and a deploy on push, realised in React and Vite. It is one shape. It is replaceable.

The **core** is the isotope: a named procedure, its slots, and a Gherkin spec that canonicalizes to
an id. Nothing in that definition names a language, a framework or a host. If somebody implemented
`cornichon` in Visual Basic and it produced the same canonical id, it would be the same isotope —
not a fork, not a port with a compatibility table.

The lab already has the proof. The canon exists twice: in Go (`isotope`), and transcribed into
`brine.py` in the vault with no dependencies beyond the standard library. Two implementations, one
identity. A third in any language would be the same test of the same claim, and that is the point
of canonicalizing: the artifact that travels is the spec, not the runtime around it.

This is also why a seed row has no `language` field and a part row does. A shape is a way of
publishing; a part is a program. Asking what language a seed is written in is asking about the
shape, and the shape is the part you are allowed to throw away.

There are already other ways to start that do not involve this shape at all:
[lemon-x-files](/plot/lemon-x-files) is a template checkout that
[create-ade-stand](/plot/create-ade-stand) clones and overlays, and a page can consume components
from a CDN with no build step. Each is a start, and each still has to publish its Gherkin if it
wants to claim an isotope.

## The ledger

Every rule on these sites has a program behind it. The table is the contract; a row that cannot be
filled in is a paragraph pretending to be a rule.

| the page says | the program that decides it |
| --- | --- |
| `RULES-01…09` at `/rules.md` | `scripts/verify-publish.mjs` — the guard, one stable id per check |
| a safety data sheet, §1–§16 | `lab-safety/sheets/features/<surface>-mcp-surface.feature`, canonicalized by `pickled-onions` into an isotope id |
| a capability rung and its ceiling | the 42i lattice in `isotope` — the same seven numbers, below |
| a lease on a connection point | `le.ad`'s `features/hot-desk.feature`, proposed to `isotope` as isotope#46 |
| a deployment is live | the site's own guard, which refuses to publish a broken one |

The direction matters. The program is the source of truth; the page is a rendering of it. When the
two disagree, the page is wrong — the playbook every child here already follows for `rules.md`,
applied to the math as well.

## One measure, seven numbers

The measure is a distance from **nominal** against **linear time**: 42i. It is one number however
it was arrived at — a stale credential, a clock skew, a tampered receipt — and it maps to a rung
that limits what a caller may read.

| rung | name | ceiling |
| --- | --- | --- |
| 0 | absolute zero | 0 |
| 1 | read-only | 20 |
| 2 | harness tools | 60 |
| 3 | mock secrets | 100 |
| 4 | higher authority | 140 |
| 5 | delegation | 180 |
| 6 | certification | 220 |

Those seven ceilings are the lattice's, not this site's. `le.ad` refuses a claim past the ceiling
of the rung it declares; the display shows the same ladder the binaries apply. If the table above
and `isotope`'s thresholds ever disagree, the table is the one to fix.

**Two numbers are not the same number.** The column on this map is a **readiness** rung (1–4:
Understand, Learn, Operate, Package) — a shelf for readers, chosen by the starter. The ladder above
is a **capability** rung (0–6) — a ceiling on what a caller may do, fixed by the protocol. They
share a word and nothing else, and the ecosystem already has a third use of the word: `VerifyTrust`
assigns 6, 4 or 2 for a verification outcome. One measure, three schemes, and only the first is
arithmetic.

## What the sites visualize

Visualization is the job these sites do that a README cannot:

- **this plot** — the systems, their cuts and their claims, as entity tables on one page;
- **[le.ad](https://james-gibson.github.io/le.ad/)** — the lease on a connection point, live: six
  desks, a claim, a lease that expires, and the record it publishes;
- **lab-safety's sheets** — the rule set as executable Gherkin, one surface at a time;
- **fire-marshall** — the lab's declared protections against the state it is actually in.

Each is a different view of one rule set. None of them may invent a rule the programs do not have;
all of them may make one easier to see.

## What keeps it honest

- The guard pins the ceiling sequence on this page, so the table cannot quietly become decorative.
- A page that states a rule without naming its program is a page the review is meant to reject —
  the ledger is short enough to check by hand, which is why it is written as a table.
- The check is on this page's copy of the numbers, not on `isotope`'s. A change upstream lands
  here as a diff a human has to make; the alternative is a build that fetches a Go repository and
  a site that cannot say what it will publish until the network answers.

## What it costs

- **One more place to update.** A ceiling change is a change here as well. The page is worth it
  only while the numbers are small enough to read at a glance.
- **A false comfort.** "The math is the same" is a claim about intent until someone diffs the
  table against the library. The guard makes that cheap; it does not make it automatic.
- **Three schemes sharing a word.** `rung` means a reader level, a capability ceiling and a trust
  verification outcome in the same ecosystem. This page names all three rather than pretending
  one of them does not exist.
