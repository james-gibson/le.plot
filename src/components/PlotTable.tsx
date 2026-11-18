import { Link } from 'react-router-dom'
import { KIND_LABEL, cuttings, isCore, isotope, parts, rungLabel, seeds, type GroupId } from '../lib/plot'

/**
 * The map as tables.
 *
 * Rendered on the server, printed in the static shell, and the only version a
 * reader without JavaScript gets. Two tables because the plot has two kinds of
 * row: a cutting taken from the starter, and a part of the lab the sites describe.
 * Forcing them into one grid would mean columns that are blank half the time.
 */
export function PlotTable({ groups }: { groups: GroupId[] }) {
  const seedRows = seeds().filter((seed) => groups.includes(seed.group))
  const partRows = parts().filter((part) => groups.includes(part.group))

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xs tracking-[0.18em] text-muted uppercase">
          Cutting from the starter — {seedRows.length} of {cuttings().length + 1} rows
        </h3>
        {seedRows.length === 0 ? (
          <p className="mt-3 rounded-xl border border-line px-4 py-3 text-sm text-muted">
            No seed rows in this layer: the deployments are the cuttings taken from the starter.
          </p>
        ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              One stock and the {cuttings().length} cuttings taken from it: readiness, front door,
              the starter it was cloned from, the isotopes it publishes, and the rules copy each keeps.
            </caption>
            <thead className="bg-surface-2 text-cream">
              <tr>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Seed</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Role</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Readiness</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Front door</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Cutting from</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Ships</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Rules</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Since</th>
              </tr>
            </thead>
            <tbody>
              {seedRows.map((seed) => (
                <tr key={seed.id} className="align-top">
                  <th scope="row" className="border-b border-line-soft px-4 py-3 text-left font-normal">
                    <Link
                      to={`/plot/${seed.id}`}
                      className="font-mono text-[13px] text-cream underline decoration-line underline-offset-4 hover:text-pulse"
                    >
                      {seed.entity}
                    </Link>
                    {isCore(seed.id) ? (
                      <span className="ml-2 rounded-full border border-pulse/50 px-1.5 py-0.5 align-middle font-mono text-[9px] tracking-[0.12em] text-pulse uppercase">
                        core
                      </span>
                    ) : null}
                    {seed.live ? (
                      <a
                        href={`${seed.live}/`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-1 block font-mono text-[11px] text-muted hover:text-cream"
                      >
                        live ↗
                      </a>
                    ) : null}
                  </th>
                  <td className="border-b border-line-soft px-4 py-3 text-xs text-muted">{seed.role}</td>
                  <td className="border-b border-line-soft px-4 py-3 text-xs">
                    <span className="font-mono text-cream">{seed.rung}</span>
                    <span className="mt-0.5 block text-muted">{rungLabel(seed.rung)}</span>
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-cream">
                    {seed.front}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-muted">
                    {seed.cuttingFrom ?? '—'}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 text-xs text-muted">
                    {seed.ships.length
                      ? seed.ships.map((name, index) => {
                          const entry = isotope(name)
                          return (
                            <span key={name}>
                              {index ? ', ' : ''}
                              {entry ? (
                                <a
                                  href={entry.gherkin}
                                  className="underline decoration-line underline-offset-2 hover:text-cream"
                                >
                                  {name}
                                </a>
                              ) : (
                                name
                              )}
                            </span>
                          )
                        })
                      : 'none'}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-muted">
                    {seed.vendors
                      ? `@${seed.vendors.version}`
                      : seed.role === 'starter'
                        ? 'publishes'
                        : 'deferred'}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-muted">
                    {seed.since ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      <div>
        <h3 className="text-xs tracking-[0.18em] text-muted uppercase">
          The lab and the reading stack — {partRows.length} of {parts().length} rows
        </h3>
        {partRows.length === 0 ? (
          <p className="mt-3 rounded-xl border border-line px-4 py-3 text-sm text-muted">
            No lab rows in this layer: this view is the deployments.
          </p>
        ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              The libraries, tools, apps and upstream the seed sites describe: what each provides,
              what it depends on, the default ports it binds, and where its source is. Ports are
              defaults from the repository; a config file or flag can move every one.
            </caption>
            <thead className="bg-surface-2 text-cream">
              <tr>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">System</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Kind</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Built</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Provides</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Depends on</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Ports</th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold">Since</th>
              </tr>
            </thead>
            <tbody>
              {partRows.map((part) => (
                <tr key={part.id} className="align-top">
                  <th scope="row" className="border-b border-line-soft px-4 py-3 text-left font-normal">
                    <Link
                      to={`/plot/${part.id}`}
                      className="font-mono text-[13px] text-cream underline decoration-line underline-offset-4 hover:text-pulse"
                    >
                      {part.entity}
                    </Link>
                    {isCore(part.id) ? (
                      <span className="ml-2 rounded-full border border-pulse/50 px-1.5 py-0.5 align-middle font-mono text-[9px] tracking-[0.12em] text-pulse uppercase">
                        core
                      </span>
                    ) : null}
                    {part.repo ? (
                      <a
                        href={`https://github.com/${part.repo}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-1 block font-mono text-[11px] text-muted hover:text-cream"
                      >
                        source ↗
                      </a>
                    ) : (
                      <span className="mt-1 block font-mono text-[11px] text-muted">local only</span>
                    )}
                  </th>
                  <td className="border-b border-line-soft px-4 py-3 text-xs text-muted">
                    {KIND_LABEL[part.kind]}
                    {part.status ? (
                      <span className="ml-1 text-violet">({part.status})</span>
                    ) : null}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-muted">
                    {part.language}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 text-xs text-muted">
                    {part.provides}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-muted">
                    {part.depends.length ? part.depends.map((dependency) => dependency.id).join(', ') : 'none'}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 font-mono text-xs">
                    {part.ports?.length ? (
                      <span
                        className="text-cream"
                        title={part.ports.map((entry) => `${entry.port} — ${entry.purpose}`).join('\n')}
                      >
                        {part.ports.map((entry) => entry.port).join(', ')}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-muted">
                    {part.since ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  )
}
