---
title: The grower
description: An engineer who wants to run one as it ships, or start one from the starter.
order: 2
updated: 2026-11-16
tags: audience, rung-2
seeds: grower
---

# The grower

You want a site, not a reading list. Start from the starter, because that is what every child did.

## Start here

The starter's front door is `/docs/quickstart` on
[le.gume](https://james-gibson.github.io/le.gume/docs/quickstart/), and its clone is the whole
distribution:

    git clone https://github.com/james-gibson/le.gume.git my-site
    cd my-site && npm install && npm run dev

Then read [the record](/docs/data-model) on this site for what to write down about the result, and
[build and deploy](/docs/deploy) for what the gate will refuse.

## What to copy, and what to cut

Copy the content model, the article typography, the guard and the post-build. Cut the copy, the
sections you are not making an argument for, and every page you cannot re-derive. The audit is on
[what this seed inherited](/docs/inherited) and it is worth reading before the first page, not
after the tenth.

## What this seed refuses

- **A generator.** `git clone` is the command. There is no `create-*` package whose template you
  cannot read.
- **A theme.** The palette is nine tokens; changing them changes every component. That is a
  feature, and it is not the same thing as a design system you can buy.
- **A promise about time.** Every child here is weeks old. The cost numbers on this site are
  measured, and the oldest one is thin.
