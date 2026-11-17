import { Link } from 'react-router-dom'
import {
  KIND_LABEL,
  getPlotRow,
  relationsOf,
  rungLabel,
} from '../lib/plot'

/**
 * The record behind a plot page.
 *
 * The same object the map draws. Fields live here, in `src/lib/plot.ts`, and
 * the prose lives in the Markdown file — so a page cannot state a live URL the
 * diagram disagrees with, and the diagram cannot draw a row with no page.
 */
export function PlotPanel({ rowId }: { rowId: string }) {
  const row = getPlotRow(rowId)
  if (!row) return null

  const relations = relationsOf(row.id)

  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-3">
        {row.role === 'part' ? (
          <>
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Kind</p>
              <p className="mt-1 text-sm text-cream">
                {KIND_LABEL[row.kind]} · <span className="font-mono">{row.language}</span>
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Provides</p>
              <p className="mt-1 text-sm leading-6 text-cream">{row.provides}</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Since</p>
              <p className="mt-1 font-mono text-sm text-cream">{row.since}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Readiness</p>
              <p className="mt-1 text-sm text-cream">
                <span className="font-mono">rung {row.rung}</span> · {rungLabel(row.rung)}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Front door</p>
              <p className="mt-1 font-mono text-sm text-cream">{row.front}</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Growing since</p>
              <p className="mt-1 font-mono text-sm text-cream">{row.since}</p>
            </div>
          </>
        )}
      </div>

      {row.role !== 'part' ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Keeps</p>
              {row.keeps.length ? (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {row.keeps.map((section) => (
                    <li
                      key={section}
                      className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-cream"
                    >
                      {section}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  No section of the starter&rsquo;s shelf: this child replaced the cast and the
                  sections with its own.
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Adds</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {row.adds.map((item) => (
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
              <p className="mt-1 font-mono text-sm text-cream">{row.inherits ?? '— (the starter)'}</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Ships</p>
              <p className="mt-1 font-mono text-sm text-cream">
                {row.ships.length ? row.ships.join(', ') : 'no isotopes'}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Rules</p>
              <p className="mt-1 text-sm text-cream">
                {row.vendors ? (
                  <>
                    <span className="font-mono">vendored @{row.vendors.version}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {row.vendors.overrides.length
                        ? `overrides ${row.vendors.overrides.join(', ')} on the record`
                        : 'no overrides on the record'}
                    </span>
                  </>
                ) : row.role === 'starter' ? (
                  'publishes rules.md; this is the source the children read'
                ) : (
                  'defers without a vendored copy'
                )}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Depends on</p>
          {row.depends.length ? (
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {row.depends.map((dependency) => (
                <li key={dependency.id} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                  <span>
                    <span className="text-cream">{dependency.verb}</span>{' '}
                    <Link
                      to={`/plot/${dependency.id}`}
                      className="font-mono text-cream underline decoration-line underline-offset-4 hover:text-pulse"
                    >
                      {dependency.id}
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Nothing on this plot: it is a floor, not a floor plan.</p>
          )}
        </div>
      )}

      {relations.length ? (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">On the map</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {relations.map((relation) => {
              const otherId = relation.from === row.id ? relation.to : relation.from
              const other = getPlotRow(otherId)
              return (
                <li key={`${relation.from}-${relation.to}`} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" />
                  <span>
                    {relation.from === row.id ? (
                      <>
                        it <span className="text-cream">{relation.verb}</span>{' '}
                      </>
                    ) : null}
                    <Link
                      to={`/plot/${otherId}`}
                      className="font-mono text-cream underline decoration-line underline-offset-4 hover:text-pulse"
                    >
                      {other?.entity ?? otherId}
                    </Link>
                    {relation.from === row.id ? null : (
                      <>
                        {' '}
                        <span className="text-cream">{relation.verb}</span> it
                      </>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 text-xs">
        {row.live ? (
          <a
            href={`${row.live}/`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-pulse underline decoration-pulse/30 underline-offset-4 hover:decoration-pulse"
          >
            {row.live.replace('https://', '')} ↗
          </a>
        ) : null}
        {row.repo ? (
          <a
            href={`https://github.com/${row.repo}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
          >
            github.com/{row.repo}
          </a>
        ) : (
          <span className="text-muted">held locally — no published source</span>
        )}
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
