---
title: le.roy jenkins
description: Mostly an internal tool, the way a cowhub would be — rotate or yield, with jenkins as the escape hatch it announces.
order: 14
updated: 2026-11-17
tags: proposal, claims, mdns
seeds: maintainer, packager
---

# le.roy jenkins

A one-shot lab tool with a single accepted request: a rotation challenge. It answers in one of
exactly two ways — **rotate** (advance the claim) or **yield** (hand it to another claimant) — and
refuses anything else by name. The name is the pun it sounds like: *le roi*, the one holding the
rotation, who may either turn it or give it away.

## Status: proposal

This row is drawn so the proposal has an address, not because a binary exists. The tool is
specified in [`lezz.go/docs/le-roy.md`](https://github.com/james-gibson/lezz.go/blob/main/docs/le-roy.md)
and is **not implemented**. Everything below is the design as written down, and the map marks it
`proposal` for that reason.

## The accepted challenge

```
le.roy check   [--dir PATH] [--claimant NAME] [--tick N]
le.roy rotate  [--dir PATH] [--claimant NAME]
le.roy yield   --to NAME [--dir PATH] [--claimant NAME]
le.roy jenkins --to NAME [--dir PATH] [--claimant NAME]
```

It accepts the **challenge**, never the answer: a rotation document carrying `pass: true` is a
claim about a verdict, so the tool binds the subject, re-runs every invariant and decides. That is
the whole security property — an agent can lie in a file, and the lie does not survive the tool.

Everything else — `start`, `stop`, `edit`, `assert`, `sign`, `force`, `--skip`, `--trust`, `--yes`
— is refused with one fixed message. If a request can be expressed, the tool has failed.

## Leeroy

`le.roy jenkins --to NAME` always yields and checks nothing: not the subject, not the verifiers,
not the claimant. It is the named exception, and it exists because an escape hatch that has to be
named is auditable while one that is merely undocumented is not.

It never rotates, it marks the rotation **unchecked**, and a receiver that runs `check` or `yield`
on that claim recomputes the verdict from the workspace. The honest sentence is: jenkins yields
the work; it does not yield the evidence.

## The announcement

The yield is published as an mDNS record for as long as the process runs, then withdrawn:

| field | value |
| --- | --- |
| service type | `_le-roy-yield._tcp` |
| instance | `le-roy-<claimant>-<tick>`, truncated to 63 bytes with a hash suffix |
| address | **loopback**, with nothing served on it |
| TXT | `v=1`, `verb=jenkins`, `claimant`, `tick`, `subject=<12 hex>`, `checked=false`, `tool=le.roy` |

A failed broadcast does not fail the yield: the rotation is yielded, the output says
`"announced": false` with the reason, and the exit code stays `0`.

## What it costs

- **A proposal is not a tool.** The command line above cannot be run, and the page says so rather
  than implying a binary the lab does not have.
- **Fan-out is amplification.** One announcement invites *N* replies on a shared medium, and mDNS
  degrades exactly under many-responder load. Awareness is opt-in — a peer must browse
  `_le-roy-yield` — but opt-in is a policy, not a limit.
- **The record is a claim, not a surface.** It names a loopback address with no listener, so a
  peer learns *that* a yield happened and cannot connect to anything. That is deliberate, and it
  is also why the record is not evidence: whoever needs a durable record keeps the JSON.
