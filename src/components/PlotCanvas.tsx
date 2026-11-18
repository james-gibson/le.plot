import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type BuiltInEdge,
  type NodeTypes,
  type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  ALL_GROUPS,
  GROUPS,
  NODE_W,
  PLOT,
  RELATIONS,
  cuttings,
  getPlotRow,
  rungLabel,
  type GroupId,
  type PlotRow,
} from '../lib/plot'
import { useMotion } from '../lib/motion'
import { PlotNode, type PlotFlowNode } from './PlotNode'

/**
 * The map, with layers.
 *
 * Twenty-eight tables and twenty-two lines is too much to read at once, and most
 * readers want one question answered: what is deployed, what runs here, or what
 * do I write with. So the map has three groups and a way back to everything.
 * The geography never moves — the same row sits in the same place in every
 * view — and a toggle hides what does not answer the question, then fits the
 * viewport to what is left.
 *
 * It is drawn in the browser only. The prerender ships the tables below the
 * canvas, which are the same rows in the same order; an agent or a reader
 * without JavaScript gets the data rather than an empty frame.
 */

const nodeTypes: NodeTypes = { seed: PlotNode }

const root = getPlotRow('le.gume')!

const nodes: PlotFlowNode[] = PLOT.map((row) => ({
  id: row.id,
  type: 'seed',
  position: row.at,
  data: { row },
  style: { width: NODE_W },
}))

/** The row's centre, used to pick the side an edge leaves from. */
function centreOf(row: PlotRow): { x: number; y: number } {
  return { x: row.at.x + NODE_W / 2, y: row.at.y + 95 }
}

/** Which side of the starter a seed sits on decides the handles the second line uses. */
function vendorHandles(child: PlotRow): { out: string; in: string } {
  const rootCentre = root.at.x + NODE_W / 2
  const childCentre = child.at.x + NODE_W / 2
  return childCentre < rootCentre
    ? { out: 'out-left', in: 'in-right' }
    : { out: 'out-right', in: 'in-left' }
}

const baseEdges: BuiltInEdge[] = []

for (const child of cuttings()) {
  baseEdges.push({
    id: `${root.id}-cuttingFrom-${child.id}`,
    source: root.id,
    target: child.id,
    sourceHandle: 'out',
    targetHandle: 'in',
    type: 'smoothstep',
    pathOptions: { borderRadius: 18, offset: 22 },
    style: { stroke: '#ff2d95', strokeWidth: 1.4 },
    markerStart: 'er-one',
    markerEnd: 'er-many',
  })

  if (!child.vendors) continue
  const { out, in: target } = vendorHandles(child)
  baseEdges.push({
    id: `${root.id}-rules-${child.id}`,
    source: root.id,
    target: child.id,
    sourceHandle: out,
    targetHandle: target,
    type: 'smoothstep',
    pathOptions: { borderRadius: 18, offset: 30 },
    style: { stroke: '#ffc2dd', strokeWidth: 1.2, strokeDasharray: '5 4' },
    markerStart: 'er-one-violet',
    markerEnd: 'er-many-violet',
  })
}

// The cross claims. A same-row pair leaves and enters on the sides; a
// cross-row pair uses the top and bottom, where provenance already lives.
for (const relation of RELATIONS) {
  const from = getPlotRow(relation.from)
  const to = getPlotRow(relation.to)
  if (!from || !to) continue
  const a = centreOf(from)
  const b = centreOf(to)
  const dx = b.x - a.x
  const dy = b.y - a.y
  // Vertical only when the two cards are nearly in a column. A bottom-to-top
  // path whose target sits *above* the source has to loop the whole row; the
  // side handles make the same claim without drawing a box around the lab.
  const vertical = Math.abs(dx) < 150 && dy > 0
  baseEdges.push({
    id: `rel-${relation.from}-${relation.to}`,
    source: relation.from,
    target: relation.to,
    sourceHandle: vertical ? 'out' : dx > 0 ? 'out-r' : 'out-l',
    targetHandle: vertical ? 'in' : dx > 0 ? 'in-l' : 'in-r',
    type: 'default',
    style: { stroke: '#a49a9e', strokeWidth: 1.1 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#a49a9e', width: 14, height: 14 },
  })
}

/**
 * Crow's-foot notation, drawn once as SVG markers and referenced by id.
 *
 * `er-one` is the bar at the starter end — exactly one starter. `er-many` is the
 * fork at the seed end — many seeds per starter. Both are userSpaceOnUse so
 * the glyph does not grow with the stroke width.
 */
function Markers() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
      <defs>
        <marker
          id="er-one"
          viewBox="0 0 12 12"
          refX="6"
          refY="6"
          markerWidth="12"
          markerHeight="12"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M6 1 V11" stroke="#ff2d95" strokeWidth="1.4" fill="none" />
        </marker>
        <marker
          id="er-many"
          viewBox="0 0 14 14"
          refX="13"
          refY="7"
          markerWidth="14"
          markerHeight="14"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M13 1 L2 7 M13 7 L2 7 M13 13 L2 7" stroke="#ff2d95" strokeWidth="1.4" fill="none" />
        </marker>
        <marker
          id="er-one-violet"
          viewBox="0 0 12 12"
          refX="6"
          refY="6"
          markerWidth="12"
          markerHeight="12"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M6 1 V11" stroke="#ffc2dd" strokeWidth="1.2" fill="none" />
        </marker>
        <marker
          id="er-many-violet"
          viewBox="0 0 14 14"
          refX="13"
          refY="7"
          markerWidth="14"
          markerHeight="14"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M13 1 L2 7 M13 7 L2 7 M13 13 L2 7" stroke="#ffc2dd" strokeWidth="1.2" fill="none" />
        </marker>
      </defs>
    </svg>
  )
}

type Props = {
  groups: GroupId[]
  onToggle: (group: GroupId) => void
  onAll: () => void
  picked: string | null
  onPick: (id: string | null) => void
}

export function PlotCanvas({ groups, onToggle, onAll, picked, onPick }: Props) {
  const instanceRef = useRef<ReactFlowInstance<PlotFlowNode, BuiltInEdge> | null>(null)
  const { mode } = useMotion()

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const visible = useMemo(() => new Set(PLOT.filter((row) => groups.includes(row.group)).map((row) => row.id)), [groups])
  const shownNodes = useMemo(() => nodes.filter((node) => visible.has(node.id)), [visible])
  const shownEdges = useMemo(
    () => baseEdges.filter((edge) => visible.has(edge.source) && visible.has(edge.target)),
    [visible],
  )

  // A view change is a camera move, not a re-layout: the geography stays put and
  // the viewport fits whatever is left. The fit is computed here from the visible
  // records rather than asked of `fitView`, because a filtered view can open
  // before the filtered nodes have been measured — and a blank canvas is a worse
  // failure than an approximate frame.
  const fit = (animate: boolean) => {
    const el = wrapRef.current
    const instance = instanceRef.current
    if (!el || !instance || shownNodes.length === 0) return
    const width = el.clientWidth
    const height = el.clientHeight
    const xs = shownNodes.map((node) => node.position.x)
    const ys = shownNodes.map((node) => node.position.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs) + NODE_W
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys) + 170
    const pad = 28
    const zoom = Math.max(
      0.15,
      Math.min((width - pad * 2) / (maxX - minX), (height - pad * 2) / (maxY - minY), 1.2),
    )
    instance.setViewport(
      {
        x: (width - (maxX - minX) * zoom) / 2 - minX * zoom,
        y: (height - (maxY - minY) * zoom) / 2 - minY * zoom,
        zoom,
      },
      { duration: animate && mode !== 'still' ? 320 : 0 },
    )
  }

  useEffect(() => {
    const timers = [40, 240].map((delay) => setTimeout(() => fit(true), delay))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, mode])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => fit(false))
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const row = picked ? getPlotRow(picked) : undefined
  const everything = groups.length === ALL_GROUPS.length

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Choose what the map shows">
        {GROUPS.map((group) => {
          const active = groups.includes(group.id)
          const count = PLOT.filter((entry) => entry.group === group.id).length
          return (
            <button
              key={group.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(group.id)}
              title={group.blurb}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                active
                  ? 'border-pulse/60 bg-pulse/10 text-cream'
                  : 'border-line text-muted hover:border-line-soft hover:text-cream'
              }`}
            >
              {group.label} <span className="font-mono text-[10px] text-muted">{count}</span>
            </button>
          )
        })}
        <button
          type="button"
          aria-pressed={everything}
          onClick={onAll}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            everything
              ? 'border-cream/50 bg-surface-2 text-cream'
              : 'border-line text-muted hover:border-line-soft hover:text-cream'
          }`}
        >
          Everything <span className="font-mono text-[10px] text-muted">{PLOT.length}</span>
        </button>
        <span className="ml-1 text-[11px] text-muted">
          showing {shownNodes.length} of {PLOT.length} rows
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#0c0a0c]">
        <Markers />
        <div ref={wrapRef} className="plot-flow h-[440px] md:h-[780px]">
          <ReactFlow
            nodes={shownNodes}
            edges={shownEdges}
            nodeTypes={nodeTypes}
            minZoom={0.15}
            maxZoom={1.8}
            nodesConnectable={false}
            elementsSelectable
            onNodeClick={(_, node) => {
              onPick(node.id)
              const centre = centreOf(PLOT.find((entry) => entry.id === node.id) ?? root)
              instanceRef.current?.setCenter(centre.x, centre.y, {
                zoom: 0.95,
                duration: mode === 'still' ? 0 : 260,
              })
            }}
            onPaneClick={() => onPick(null)}
            onInit={(instance) => {
              instanceRef.current = instance
              fit(false)
            }}
          >
            <Background color="#2a242a" gap={24} size={1} />
            <Controls showInteractive={false} position="top-right" />
          </ReactFlow>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
        <span className="flex items-center gap-2">
          <svg width="34" height="8" aria-hidden="true">
            <line x1="1" y1="4" x2="33" y2="4" stroke="#ff2d95" strokeWidth="1.4" />
          </svg>
          a cutting taken from the starter — provenance, not a dependency
        </span>
        <span className="flex items-center gap-2">
          <svg width="34" height="8" aria-hidden="true">
            <line x1="1" y1="4" x2="33" y2="4" stroke="#ffc2dd" strokeWidth="1.2" strokeDasharray="5 4" />
          </svg>
          vendors rules.md, versioned
        </span>
        <span className="flex items-center gap-2">
          <svg width="34" height="8" aria-hidden="true">
            <line x1="1" y1="4" x2="33" y2="4" stroke="#a49a9e" strokeWidth="1.1" />
          </svg>
          a claim in a row (the verb is on the row&rsquo;s page)
        </span>
        <span>drag to pan · scroll or pinch to zoom · select a table for its row</span>
      </div>

      {row ? (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-mono text-sm text-cream">{row.entity}</p>
            <p className="text-[11px] tracking-[0.12em] text-muted uppercase">
              {row.role === 'part'
                ? `${row.kind} · ${row.language}`
                : `rung ${row.rung} · ${rungLabel(row.rung)}`}
              {row.since ? ` · since ${row.since}` : ''}
            </p>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{row.note}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <Link
              to={`/plot/${row.id}`}
              className="text-pulse underline decoration-pulse/30 underline-offset-4 hover:decoration-pulse"
            >
              Read the page
            </Link>
            {row.live ? (
              <a
                href={`${row.live}/`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
              >
                {row.live.replace('https://', '')}
              </a>
            ) : null}
            {row.repo ? (
              <a
                href={`https://github.com/${row.repo}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
              >
                {row.repo}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
