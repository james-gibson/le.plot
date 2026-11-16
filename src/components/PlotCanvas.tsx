import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Background,
  Controls,
  ReactFlow,
  type BuiltInEdge,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { PLOT, children, getPlotSeed, rungLabel } from '../lib/plot'
import { useMotion } from '../lib/motion'
import { PlotNode, type PlotFlowNode } from './PlotNode'

/**
 * The map.
 *
 * One page, five tables, six relationships. React Flow draws it because the
 * reader is the one who decides what to look at: pan to a seed, zoom into its
 * fields, select it for the full row. Nothing moves on its own — a diagram is
 * not a slideshow, and the motion budget applies.
 *
 * It is drawn in the browser only. The prerender ships the table below the
 * canvas, which is the same five rows in the same order; an agent or a reader
 * without JavaScript gets the data rather than an empty frame.
 */

const nodeTypes: NodeTypes = { seed: PlotNode }

const NODE_WIDTH = 300
const root = getPlotSeed('le.gume')!

const nodes: PlotFlowNode[] = PLOT.map((seed) => ({
  id: seed.id,
  type: 'seed',
  position: seed.at,
  data: { seed },
  style: { width: NODE_WIDTH },
}))

/** Which side of the parent a child sits on decides which handles the second line uses. */
function sides(childX: number): { out: string; in: string } {
  const rootCentre = root.at.x + NODE_WIDTH / 2
  const childCentre = childX + NODE_WIDTH / 2
  return childCentre < rootCentre
    ? { out: 'out-left', in: 'in-right' }
    : { out: 'out-right', in: 'in-left' }
}

const edges: BuiltInEdge[] = children().flatMap((child, index) => {
  const { out, in: target } = sides(child.at.x)
  const inherits: BuiltInEdge = {
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
    zIndex: 0 + index,
  }
  if (!child.vendors) return [inherits]

  const vendors: BuiltInEdge = {
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
    zIndex: 10,
  }
  return [inherits, vendors]
})

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
  const [narrow, setNarrow] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const { mode } = useMotion()

  useEffect(() => {
    setNarrow(window.matchMedia('(max-width: 767px)').matches)
    setMounted(true)
  }, [])

  const seed = picked ? getPlotSeed(picked) : undefined

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#0c0a0c]">
        <Markers />
        {mounted ? (
          <div className="plot-flow h-[420px] md:h-[660px]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              /* A phone cannot fit 1,200 flow units of table into 350 pixels
                 and still be read. On a narrow screen the map opens at a
                 readable zoom on the root and is panned; the table below has
                 every row, and the fit control still gives the overview. */
              fitView={!narrow}
              fitViewOptions={{ padding: 0.12, duration: mode === 'still' ? 0 : 220 }}
              onInit={(instance) => {
                // Centre the parent table, not the bounding box: a phone should
                // open on the row that explains the other four.
                if (narrow) instance.setCenter(600, 140, { zoom: 0.6 })
              }}
              minZoom={0.3}
              maxZoom={1.8}
              nodesConnectable={false}
              elementsSelectable
              onNodeClick={(_, node) => setPicked(node.id)}
              onPaneClick={() => setPicked(null)}
            >
              <Background color="#2a242a" gap={24} size={1} />
              <Controls showInteractive={false} position="top-right" />
            </ReactFlow>
          </div>
        ) : (
          <div className="flex h-[420px] flex-col items-center justify-center gap-3 px-6 text-center md:h-[660px]">
            <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
              the map is drawn in the browser
            </p>
            <p className="max-w-sm text-sm leading-6 text-muted">
              The same five rows are in the table below, in the same order — nothing here is on the
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
          inherits the seed (one parent, many children)
        </span>
        <span className="flex items-center gap-2">
          <svg width="34" height="8" aria-hidden="true">
            <line
              x1="1"
              y1="4"
              x2="33"
              y2="4"
              stroke="#ffc2dd"
              strokeWidth="1.2"
              strokeDasharray="5 4"
            />
          </svg>
          vendors rules.md, versioned
        </span>
        <span>drag to pan · scroll or pinch to zoom · select a table for its row</span>
      </div>

      {seed ? (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-mono text-sm text-cream">{seed.entity}</p>
            <p className="text-[11px] tracking-[0.12em] text-muted uppercase">
              rung {seed.rung} · {rungLabel(seed.rung)} · since {seed.since}
            </p>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{seed.note}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <Link
              to={`/plot/${seed.id}`}
              className="text-pulse underline decoration-pulse/30 underline-offset-4 hover:decoration-pulse"
            >
              Read the page
            </Link>
            {seed.live ? (
              <a
                href={`${seed.live}/`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
              >
                {seed.live.replace('https://', '')}
              </a>
            ) : null}
            <a
              href={`https://github.com/${seed.repo}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
            >
              {seed.repo}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
