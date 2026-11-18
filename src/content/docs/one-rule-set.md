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
what that job turned out to need. Every site in this family is a **sprout** of that job.

The claim that makes it more than a family resemblance is narrow and testable: **the rules a page
states are the rules the Go programs enforce, and the math is the same math.** A page that
disagrees with a binary is a failing test, not a stale sentence — that is the whole reason
lab-safety writes its safety data sheets as Gherkin and has them canonicalized into isotope ids.

## Propagation, not lineage

The vocabulary is horticultural because the operation is:

| word | what it is here |
| --- | --- |
| **stock** | `le.gume` — the plant the cuttings come from. Not a parent; nothing is inherited at run time. |
| **cutting** | a site repository, taken from the stock once. `cuttingFrom` on a row records it. |
| **sprout** | the deployed origin that grew from the cutting. This is what a reader opens. |
| **seed** | the family noun for a cutting and its sprout together, because that is what one repository becomes. |

Stock, cutting, sprout. The first is not above the second, and the second is not owned by the
first: a cutting carries the stock's *claims* — the guard, the rule ids, the arithmetic — and it
carries them as code it can run, which is why deleting the edge from the map changes the picture
and not the build.

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
