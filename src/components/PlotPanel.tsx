import { Link } from 'react-router-dom'
import {
  KIND_LABEL,
  isCore,
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
      {isCore(row.id) ? (
        <p className="rounded-2xl border border-pulse/40 bg-surface px-5 py-3 text-sm text-muted">
          <span className="font-mono text-[11px] tracking-[0.14em] text-pulse uppercase">core</span>{' '}
          — one of the four bodies the rest of the plot orbits:
          <span className="font-mono text-cream"> le.gume · adhd · ocd-smoke-alarm · fire-marshall</span>
        </p>
      ) : null}

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
              <p className="mt-1 font-mono text-sm text-cream">{row.since ?? '—'}</p>
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
              <p className="mt-1 font-mono text-sm text-cream">{row.since ?? '—'}</p>
            </div>
          </>
        )}
      </div>

      {row.status ? (
        <div className="rounded-2xl border border-violet/40 bg-surface p-5">
          <p className="text-xs tracking-[0.14em] text-violet uppercase">Status</p>
          <p className="mt-1 text-sm leading-6 text-cream">
            {row.status} — specified and reviewed, not implemented. The map draws it so the
            proposal has an address; the page says which parts exist today.
          </p>
        </div>
      ) : null}

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
                  No section of the starter&rsquo;s shelf: this seed replaced the cast and the
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

          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs tracking-[0.14em] text-muted uppercase">Demonstrates</p>
            <p className="mt-1 text-sm text-cream">{row.demonstrates}</p>
          </div>

          <div className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">Cutting from</p>
              <p className="mt-1 font-mono text-sm text-cream">{row.cuttingFrom ?? '— (this is the starter)'}</p>
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
                  'publishes rules.md; this is the source the seeds read'
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

      {row.ports?.length ? (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Default ports</p>
          <ul className="mt-2 divide-y divide-line-soft">
            {row.ports.map((entry) => (
              <li key={entry.port} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2">
                <span className="w-16 font-mono text-sm text-cream">{entry.port}</span>
                <span className="text-sm text-muted">{entry.purpose}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            These are defaults read from the repository, not a reservation: a config file or a flag
            can move every one, and a cluster that runs twice has to.
          </p>
        </div>
      ) : null}

      {relations.length ? (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">On the map</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {relations.map((relation) => {
              const from = getPlotRow(relation.from)
              const to = getPlotRow(relation.to)
              const name = (id: string, entity: string | undefined) =>
                id === row.id ? (
                  <span className="font-mono text-cream">this row</span>
                ) : (
                  <Link
                    to={`/plot/${id}`}
                    className="font-mono text-cream underline decoration-line underline-offset-4 hover:text-pulse"
                  >
                    {entity ?? id}
                  </Link>
                )
              return (
                <li key={`${relation.from}-${relation.to}`} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" />
                  <span>
                    {name(relation.from, from?.entity)} <span className="text-cream">{relation.verb}</span>{' '}
                    {name(relation.to, to?.entity)}
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
