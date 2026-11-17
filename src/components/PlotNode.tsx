import { Link } from 'react-router-dom'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { KIND_LABEL, rungLabel, type PlotRow } from '../lib/plot'

/** The node the flow draws: one row of the plot as a table, keys first. */
export type PlotFlowNode = Node<{ row: PlotRow }, 'seed'>

function Row({ k, v, title }: { k: string; v: string; title?: string }) {
  return (
    <div className="flex items-baseline gap-2 px-3 py-[5px]">
      <span className="w-[62px] shrink-0 font-mono text-[9.5px] tracking-[0.08em] text-muted uppercase">
        {k}
      </span>
      <span
        className="min-w-0 flex-1 truncate font-mono text-[11px] leading-5 text-cream"
        title={title ?? v}
      >
        {v}
      </span>
    </div>
  )
}

export function PlotNode({ data, selected }: NodeProps<PlotFlowNode>) {
  const row = data.row
  const isPart = row.role === 'part'
  const rules = !isPart && row.vendors
    ? `vendored @${row.vendors.version}`
    : row.role === 'starter'
      ? 'publishes rules.md'
      : 'deferred'

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-surface text-left transition-colors ${
        selected ? 'border-pulse shadow-[0_0_0_1px_var(--color-pulse)]' : 'border-line'
      }`}
    >
      {/* Vertical handles carry inheritance; the side pair carries a cross claim,
          so an edge that runs along a row does not leave the top of a card. */}
      <Handle id="in" type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle
        id="in-left"
        type="target"
        position={Position.Top}
        style={{ opacity: 0, left: '30%' }}
      />
      <Handle
        id="in-right"
        type="target"
        position={Position.Top}
        style={{ opacity: 0, left: '70%' }}
      />
      <Handle id="out" type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle
        id="out-left"
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, left: '30%' }}
      />
      <Handle
        id="out-right"
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, left: '70%' }}
      />
      <Handle
        id="in-l"
        type="target"
        position={Position.Left}
        style={{ opacity: 0, top: '55%' }}
      />
      <Handle
        id="in-r"
        type="target"
        position={Position.Right}
        style={{ opacity: 0, top: '55%' }}
      />
      <Handle
        id="out-l"
        type="source"
        position={Position.Left}
        style={{ opacity: 0, top: '55%' }}
      />
      <Handle
        id="out-r"
        type="source"
        position={Position.Right}
        style={{ opacity: 0, top: '55%' }}
      />

      <header className="flex items-center justify-between gap-2 border-b border-line bg-surface-2 px-3 py-2">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              row.role === 'starter' ? 'bg-pulse' : row.role === 'seed' ? 'bg-violet' : 'bg-muted'
            }`}
          />
          <span
            className="truncate font-mono text-[12.5px] font-semibold text-cream"
            title={row.entity}
          >
            {row.entity}
          </span>
        </span>
        {/* One badge, not two: a status is the role that matters. A second
            pill did not fit beside a long package name and wrapped the header. */}
        <span
          className={`shrink-0 rounded-full border px-1.5 py-px text-[9px] tracking-[0.12em] uppercase ${
            row.status ? 'border-violet/50 text-violet' : 'border-line text-muted'
          }`}
        >
          {row.status ?? row.role}
        </span>
      </header>

      <div className="divide-y divide-line-soft/70">
        <Row k="PK id" v={row.id} />
        {isPart ? (
          <>
            <Row k="kind" v={`${KIND_LABEL[row.kind]} · ${row.language}`} />
            <Row
              k="depends"
              v={row.depends.length ? row.depends.map((dependency) => dependency.id).join(', ') : 'none'}
              title={
                row.depends.length
                  ? row.depends.map((dependency) => `${dependency.verb} ${dependency.id}`).join(' · ')
                  : 'no dependency on another row'
              }
            />
            {/* Always present on a part row, even when empty: a ragged row of
                cards makes a comparison between neighbours harder, and "—" is
                information about a service that opens no socket. */}
            <Row
              k="ports"
              v={row.ports?.length ? row.ports.map((entry) => entry.port).join(', ') : '—'}
              title={
                row.ports?.length
                  ? row.ports.map((entry) => `${entry.port} — ${entry.purpose}`).join('\n')
                  : 'no network port: it does not open a socket'
              }
            />
          </>
        ) : (
          <>
            <Row k="rung" v={`${row.rung} · ${rungLabel(row.rung)}`} />
            <Row k="front" v={row.front} />
            <Row k="FK" v={row.inherits ?? '—'} title={row.inherits ? `inherits ${row.inherits}` : 'the starter: no parent'} />
          </>
        )}
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
        <Link
          to={`/plot/${row.id}`}
          className="nodrag font-mono text-[10.5px] text-pulse underline decoration-pulse/30 underline-offset-2 hover:decoration-pulse"
        >
          /plot/{row.id}
        </Link>
        {row.live ? (
          <a
            className="nodrag font-mono text-[10.5px] text-muted underline decoration-line underline-offset-2 hover:text-cream"
            href={`${row.live}/`}
            target="_blank"
            rel="noreferrer noopener"
          >
            site ↗
          </a>
        ) : row.repo ? (
          <a
            className="nodrag font-mono text-[10.5px] text-muted underline decoration-line underline-offset-2 hover:text-cream"
            href={`https://github.com/${row.repo}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            source ↗
          </a>
        ) : (
          <span className="font-mono text-[10.5px] text-muted">local only</span>
        )}
      </footer>
    </article>
  )
}
