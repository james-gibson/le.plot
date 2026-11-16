---
description: Add one Markdown page to le.plot, verify it with the guard and smoke, and commit locally
---

Add one page to the le.plot site. The argument names the section, and may include a slug:

$ARGUMENTS

Follow `.opencode/skills/le-plot-content/SKILL.md` and `AGENTS.md`:

1. Pick the section the request belongs to, and say why in one line.
2. Write exactly one file: `src/content/<section>/<slug>.md`, with `title` and `description`
   frontmatter, and `order` where the section is ordered.
3. If it is a seed page under `plot/`, add its record in `src/lib/plot.ts` in the same change —
   the build refuses either half alone.
4. Write internal links root-absolute (`/plot/le.go`); never hand-write the `/le.plot/` mount.
5. Keep the house voice: dry, specific, cost-first. State what the thing costs as well as what it
   buys.
6. Run `npm run build` (the guard is the gate) and `npm run smoke`.
7. Commit locally. Push only when the request says publish, ship or deploy.

Report, in this order: the file you touched, the guard line, the smoke count, and whether the
change is live.
