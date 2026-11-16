import { Link } from 'react-router-dom'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { rungLabel, type PlotSeed } from '../lib/plot'

/** The node the flow draws: one seed as a table, keys first. */
export type PlotFlowNode = Node<{ seed: PlotSeed }, 'seed'>

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
  const seed = data.seed
  const rules = seed.vendors
    ? `vendored @${seed.vendors.version}`
    : seed.role === 'starter'
      ? 'publishes rules.md'
      : 'deferred'

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-surface text-left transition-colors ${
        selected ? 'border-pulse shadow-[0_0_0_1px_var(--color-pulse)]' : 'border-line'
      }`}
    >
      {/* Six handles: the map routes a line from the one side the child sits on,
          so two relationships between the same pair draw as two lines, not one. */}
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

      <header className="flex items-center justify-between gap-2 border-b border-line bg-surface-2 px-3 py-2">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              seed.role === 'starter' ? 'bg-pulse' : 'bg-violet'
            }`}
          />
          <span className="truncate font-mono text-[12.5px] font-semibold text-cream">
            {seed.entity}
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-line px-1.5 py-px text-[9px] tracking-[0.12em] text-muted uppercase">
          {seed.role}
        </span>
      </header>

      <div className="divide-y divide-line-soft/70">
        <Row k="PK id" v={seed.id} />
        <Row k="rung" v={`${seed.rung} · ${rungLabel(seed.rung)}`} />
        <Row k="front" v={seed.front} />
        <Row k="FK" v={seed.inherits ?? '—'} title={seed.inherits ? `inherits ${seed.inherits}` : 'the starter: no parent'} />
        <Row k="ships" v={seed.ships.length ? seed.ships.join(', ') : 'none'} />
        <Row k="rules" v={rules} />
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
        <Link
          to={`/plot/${seed.id}`}
          className="nodrag font-mono text-[10.5px] text-pulse underline decoration-pulse/30 underline-offset-2 hover:decoration-pulse"
        >
          /plot/{seed.id}
        </Link>
        {seed.live ? (
          <a
            className="nodrag font-mono text-[10.5px] text-muted underline decoration-line underline-offset-2 hover:text-cream"
            href={`${seed.live}/`}
            target="_blank"
            rel="noreferrer noopener"
          >
            site ↗
          </a>
        ) : null}
      </footer>
    </article>
  )
}
