import { useEffect, useRef, useState } from 'react'
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
  NODE_W,
  PLOT,
  RELATIONS,
  children,
  getPlotRow,
  parts,
  rungLabel,
  type PlotRow,
} from '../lib/plot'
import { useMotion } from '../lib/motion'
import { PlotNode, type PlotFlowNode } from './PlotNode'

/**
 * The map.
 *
 * Seventeen tables, fourteen lines. React Flow draws it because the reader is the
 * one who decides what to look at: pan to a row, zoom into its fields, select
 * it for the record. Nothing moves on its own — a diagram is not a slideshow,
 * and the motion budget applies.
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

/** Which side of the parent a child sits on decides the handles the second line uses. */
function vendorHandles(child: PlotRow): { out: string; in: string } {
  const rootCentre = root.at.x + NODE_W / 2
  const childCentre = child.at.x + NODE_W / 2
  return childCentre < rootCentre
    ? { out: 'out-left', in: 'in-right' }
    : { out: 'out-right', in: 'in-left' }
}

const edges: BuiltInEdge[] = []

for (const child of children()) {
  edges.push({
    id: `${root.id}-inherits-${child.id}`,
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
  edges.push({
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

// The cross claims. A horizontal pair leaves and enters on the sides; a
// vertical pair uses the top and bottom, where inheritance already lives.
for (const [index, relation] of RELATIONS.entries()) {
  const from = getPlotRow(relation.from)
  const to = getPlotRow(relation.to)
  if (!from || !to) continue
  const a = centreOf(from)
  const b = centreOf(to)
  const dx = b.x - a.x
  const dy = b.y - a.y
  // A cross-row claim leaves the bottom of its card; only a same-row claim runs
  // along the sides, where a bezier would otherwise sweep across the row.
  const horizontal = Math.abs(dy) < 80 && Math.abs(dx) > 80
  edges.push({
    id: `rel-${relation.from}-${relation.to}`,
    source: relation.from,
    target: relation.to,
    sourceHandle: horizontal ? (dx > 0 ? 'out-r' : 'out-l') : 'out',
    targetHandle: horizontal ? (dx > 0 ? 'in-l' : 'in-r') : 'in',
    type: 'smoothstep',
    pathOptions: { borderRadius: 16, offset: 20 },
    style: { stroke: '#a49a9e', strokeWidth: 1.1 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#a49a9e', width: 14, height: 14 },
    zIndex: 20 + index,
  })
}

/**
 * Crow's-foot notation, drawn once as SVG markers and referenced by id.
 *
 * `er-one` is the bar at the parent end — exactly one parent. `er-many` is the
 * fork at the child end — many children per parent. Both are userSpaceOnUse so
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

export function PlotCanvas() {
  const [mounted, setMounted] = useState(false)
    const [picked, setPicked] = useState<string | null>(null)
  const instanceRef = useRef<ReactFlowInstance<PlotFlowNode, BuiltInEdge> | null>(null)
  const { mode } = useMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  const row = picked ? getPlotRow(picked) : undefined

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#0c0a0c]">
        <Markers />
        {mounted ? (
          <div className="plot-flow h-[440px] md:h-[780px]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              /* A phone shows the whole plot as a shape, not as clipped cards:
                 the tables below carry the values, and a tap on a card zooms to
                 reading size. Clipping the map looked broken; a small map does
                 not. */
              fitView
              fitViewOptions={{ padding: 0.1, duration: mode === 'still' ? 0 : 220 }}
              minZoom={0.18}
              maxZoom={1.8}
              nodesConnectable={false}
              elementsSelectable
              onNodeClick={(_, node) => {
                setPicked(node.id)
                // Read the table by looking at it: a click brings the row to a
                // legible zoom and centres it, rather than leaving the reader to
                // scroll-zoom after selecting.
                const centre = centreOf(PLOT.find((row) => row.id === node.id) ?? root)
                instanceRef.current?.setCenter(centre.x, centre.y, {
                  zoom: 0.95,
                  duration: mode === 'still' ? 0 : 260,
                })
              }}
              onPaneClick={() => setPicked(null)}
              onInit={(instance) => {
                instanceRef.current = instance
                // `fitView` is queued until the nodes are measured; a second call
                // after the first paint makes the initial view deterministic even
                // if a node's height arrived late.
                setTimeout(() => instance.fitView({ padding: 0.1, duration: 0 }), 60)
              }}
            >
              <Background color="#2a242a" gap={24} size={1} />
              <Controls showInteractive={false} position="top-right" />
            </ReactFlow>
          </div>
        ) : (
          <div className="flex h-[440px] flex-col items-center justify-center gap-3 px-6 text-center md:h-[780px]">
            <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
              the map is drawn in the browser
            </p>
            <p className="max-w-sm text-sm leading-6 text-muted">
              The same rows are in the tables below, in the same order — nothing here is on the
              diagram and nowhere else.
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
        <span className="flex items-center gap-2">
          <svg width="34" height="8" aria-hidden="true">
            <line x1="1" y1="4" x2="33" y2="4" stroke="#ff2d95" strokeWidth="1.4" />
          </svg>
          inherits the starter (one parent, many children)
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
                : `rung ${row.rung} · ${rungLabel(row.rung)}`}{' '}
              · since {row.since}
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
            <a
              href={`https://github.com/${row.repo}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
            >
              {row.repo}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
