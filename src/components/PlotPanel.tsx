import { Link } from 'react-router-dom'
import { getPlotSeed, rungLabel } from '../lib/plot'

/**
 * The record behind a plot page.
 *
 * The same object the map draws. Fields live here, in `src/lib/plot.ts`, and
 * the prose lives in the Markdown file — so a page cannot state a live URL the
 * diagram disagrees with, and the diagram cannot draw a seed with no page.
 */
export function PlotPanel({ seedId }: { seedId: string }) {
  const seed = getPlotSeed(seedId)
  if (!seed) return null

  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Readiness</p>
          <p className="mt-1 text-sm text-cream">
            <span className="font-mono">rung {seed.rung}</span> · {rungLabel(seed.rung)}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Front door</p>
          <p className="mt-1 font-mono text-sm text-cream">{seed.front}</p>
        </div>
        <div>
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Growing since</p>
          <p className="mt-1 font-mono text-sm text-cream">{seed.since}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Keeps</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {seed.keeps.map((section) => (
              <li
                key={section}
                className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-cream"
              >
                {section}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Adds</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {seed.adds.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Inherits</p>
          <p className="mt-1 font-mono text-sm text-cream">{seed.inherits ?? '— (the starter)'}</p>
        </div>
        <div>
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Ships</p>
          <p className="mt-1 font-mono text-sm text-cream">
            {seed.ships.length ? seed.ships.join(', ') : 'no isotopes'}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Rules</p>
          <p className="mt-1 text-sm text-cream">
            {seed.vendors ? (
              <>
                <span className="font-mono">vendored @{seed.vendors.version}</span>
                <span className="mt-1 block text-xs text-muted">
                  {seed.vendors.overrides.length
                    ? `overrides ${seed.vendors.overrides.join(', ')} on the record`
                    : 'no overrides on the record'}
                </span>
              </>
            ) : seed.role === 'starter' ? (
              'publishes rules.md; this is the source the children read'
            ) : (
              'defers without a vendored copy'
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        {seed.live ? (
          <a
            href={`${seed.live}/`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-pulse underline decoration-pulse/30 underline-offset-4 hover:decoration-pulse"
          >
            {seed.live.replace('https://', '')} ↗
          </a>
        ) : null}
        <a
          href={`https://github.com/${seed.repo}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
        >
          github.com/{seed.repo}
        </a>
        <Link
          to="/"
          className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
        >
          back to the map
        </Link>
      </div>
    </div>
  )
}
