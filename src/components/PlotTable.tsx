import { Link } from 'react-router-dom'
import { PLOT, rungLabel } from '../lib/plot'

/**
 * The map as a table.
 *
 * Rendered on the server, printed in the static shell, and the only version a
 * reader without JavaScript gets. It is not a fallback in the apologetic sense:
 * five rows is a table, and a table is usually the better instrument. The
 * diagram is for the shape; this is for the values.
 */
export function PlotTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          The five seeds on the plot: role, readiness, front door, parent, published isotopes and
          the rules copy each keeps.
        </caption>
        <thead className="bg-surface-2 text-cream">
          <tr>
            <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
              Seed
            </th>
            <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
              Role
            </th>
            <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
              Readiness
            </th>
            <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
              Front door
            </th>
            <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
              Inherits
            </th>
            <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
              Ships
            </th>
            <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
              Rules
            </th>
            <th scope="col" className="border-b border-line px-4 py-3 font-semibold">
              Since
            </th>
          </tr>
        </thead>
        <tbody>
          {PLOT.map((seed) => (
            <tr key={seed.id} className="align-top">
              <th scope="row" className="border-b border-line-soft px-4 py-3 text-left font-normal">
                <Link
                  to={`/plot/${seed.id}`}
                  className="font-mono text-[13px] text-cream underline decoration-line underline-offset-4 hover:text-pulse"
                >
                  {seed.entity}
                </Link>
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
                {seed.inherits ?? '—'}
              </td>
              <td className="border-b border-line-soft px-4 py-3 text-xs text-muted">
                {seed.ships.length ? seed.ships.join(', ') : 'none'}
              </td>
              <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-muted">
                {seed.vendors
                  ? `@${seed.vendors.version}`
                  : seed.role === 'starter'
                    ? 'publishes'
                    : 'deferred'}
              </td>
              <td className="border-b border-line-soft px-4 py-3 font-mono text-xs text-muted">
                {seed.since}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
