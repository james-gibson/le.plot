---
title: The words, and who decides them
description: A register for the shared vocabulary — seed, cutting, sprout, pickle, isotope — and the four things "isotope" means in this lab.
order: 7
updated: 2026-11-17
tags: rule, vocabulary, isotope, shelf
seeds: maintainer, packager
---

# The words, and who decides them

The family uses a small vocabulary and has never written it down, which is how `gherkin` ended up
both a test language and a pickle, and how one word came to mean a trust measurement, a canonical
spec id and a procedure page. This page is the register: each word, what it means, and which file
decides it.

Vocabulary is not decoration here. A name is an address — it is in a URL, in a QR code, in an
agent's prompt — so the register is about which words may move and which may not.

## The three tiers of the pickle language

| word | what it is | who decides it |
| --- | --- | --- |
| **brine** | the medium: the canon that turns a feature file into a token stream and an id | `brine.py` in the vault |
| **pickled-onions** | the press: the chronicler that maintains the seeds which get canonicalized | `github.com/james-gibson/pickled-onions` |
| **pickle** | the preserved thing: a page whose name is a pickled vegetable | `le.gume`, `/isotopes/what-is-an-isotope` |

A tool is named after the **process** it performs; an artifact is named after the **preserved
thing**. That is why `pickled-onions` is right as a tool and would be wrong as an isotope, and why
`brine` is not a name any isotope may take.

## The shelf

The starter states three rules for the names themselves, and this plot follows them rather than
restating them:

1. **Never renumber.** A name is an identity; a position is a coincidence.
2. **Pick the shape, not the flavour.** The pickle should describe the system: whole, small,
   nested, mixed. A name that misleads is worse than a dull one.
3. **A published name is permanent.** Retire an isotope by removing its page, never by reusing the
   name.

The shelf it describes is `silverskin` (whole), `cornichon` (small), `pearl` (nested),
`piccalilli` (mixed). A flavour (`dill`), a cultivar already spoken for (`gherkin`), or a process
(`brine`) is off the shelf.

## The audit, as a receipt

Five isotopes travel between the seeds on this plot. Three are on the shelf. Two are not, and are
carried as debt rather than renamed, because a published name is an address:

| isotope | shelf | note |
| --- | --- | --- |
| `silverskin` | on | a whole small onion — self-contained systems |
| `cornichon` | on | a small gherkin, picked often — small recurring checks |
| `piccalilli` | on | mixed, chopped, brined — a composite of several parts |
| `dill` | **off** | a flavour and a herb, not a shape |
| `gherkin` | **off** | the spec language, not a pickle — and `cornichon` already covers the small gherkin |

`OFF_SHELF` in `src/lib/plot.ts` is the allowlist, and the build refuses a sixth pickle that is off
the shelf without being on it. The register and the record are checked against each other, so this
table cannot quietly disagree with the map.

## Names and verbs

A seed has a **preferred name** and a **verb**, and the tooling sometimes forces a different
spelling of the first. `@lemon/ade-stand` is the name anyone would say; npm only honours the
`create` alias for a package called `create-…`, so the published name is
`@lemon/create-ade-stand` and the verb is `npm create @lemon/ade-stand`. Both are recorded in the
plot's row: the forced spelling is what the registry resolves, the preferred one is what a reader
sees, and the verb is how you actually invoke it.

The same shape holds across the family, which is why it is a field rather than a sentence: `le.ad`'s
verb is *take a desk*, `le.gume`'s is *clone*, and a generator's is *create*. A row that names a
thing and cannot say what you do with it is a catalogue entry.

## Four things called "isotope"

The word is doing four jobs. They are related — the same canon gives three of them identity — but
they are not interchangeable, and a page that blurs them is a page that will be wrong:

| sense | what it is | where it is decided |
| --- | --- | --- |
| **the measure** | 42i distance from nominal against linear time, mapped to a capability rung | `github.com/james-gibson/isotope` (Go) |
| **the spec identity** | 43-character id of a feature file: `base64url(sha256(canonical raw))` | `brine.py`, and the canon it transcribes |
| **the probe result** | feature id + payload hash + nonce, identifying one executed probe | smoke-alarm's `isotope-construction.md` — a *different* construction |
| **the procedure page** | a pickle-named page: a named procedure, its slots, its Gherkin | the seed that publishes it |

The distinction that matters most is the third: a spec's id and a probe's id are both called
isotopes and are built differently. The vault's `brine.py` says so in its own header, which is how
this register knows.

A pickle name (`silverskin`) is **not** an isotope id (`6fBcXp8gZNhh…`). One is a shelf name for a
page; the other is content-addressed and changes when the Gherkin changes. Pages carry the first,
`brine/` files carry the second.

## Words this plot uses for growth

The register is not only about pickles. The family's growth vocabulary is:

| word | what it is here |
| --- | --- |
| **seed** | the family noun for a repository and the origin it deploys |
| **stock** | the starter, `le.gume` — where cuttings come from |
| **cutting** | a repository taken from the stock once (`cuttingFrom` on a row) |
| **sprout** | the deployed origin that grew from a cutting |
| **shape** | a way of publishing — content model, guard, deploy. `le.gume` is one; it is replaceable |
| **core** | the isotope: spec, slots, canonical id. Language-free, and the thing that travels |
| **proliferate** | what an isotope does: the same Gherkin carried by several seeds |

The words are descriptive, not load-bearing. What is load-bearing is that an isotope is the shared
Gherkin and that an address resolves — the two things this plot's build refuses to let rot.

## What keeps this honest

- `OFF_SHELF` fails the build for a new off-shelf name; the page must name every entry on it.
- `ships` must resolve to `ISOTOPES`, in both directions (see [the shared Gherkin](/#shared-gherkin)).
- The shelf's three rules live in the starter, not here: this page cites them so the register has
  one authority per word, and the starter keeps the one it invented.

## What it costs

- **Two names that will keep confusing people.** `gherkin` and `dill` are in URLs, so fixing them
  is a migration, not an edit. The debt is visible; it is not free.
- **A register that can fall behind.** Four senses of one word is a lot to keep straight, and this
  table is only useful if a new sense is added to it before it is used.
