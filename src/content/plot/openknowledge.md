---
title: openknowledge
description: A local Markdown editor and LLM wiki — where the files get edited by hand.
order: 23
updated: 2026-11-17
tags: app, editor
seeds: reader, grower
---

# openknowledge

A desktop Markdown editor built for knowledge bases and LLM wikis: local-first, no account, and an
MCP integration surface so an agent and a person can work on the same files.

It is in the **reading & writing** layer because the vault it opens is the vault this site is built
from. The editor is a view of the files; the files are the truth.

## What it adds to the loop

- **A human edit path.** The plot's prose is written in Markdown, and a person needs somewhere to
  write it that is not a terminal.
- **MCP as a peer, not a plugin.** The same files an agent reads through a tool are open in the
  editor, so "the agent changed the file under me" is a state both sides have to handle.
- **A local store.** The source of truth is the directory on disk; the app is replaceable.

## What it costs

- **Two writers, one file.** A person and an agent editing the same page is a merge problem with no
  merge tool. The site's answer is a build that fails loudly, not a lock.
- **A second application on the vault.** The plot does not depend on it, but a reader who adopts it
  has adopted a desktop app to read Markdown.
- **A published app with a moving version.** The repository (`inkeep/open-knowledge`) and the
  installed build are separate artifacts; the row records the app, and the page does not claim a
  version the reader can pin.
