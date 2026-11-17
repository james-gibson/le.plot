import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, CopyButton } from 'fancy-ui-react'
import { MotionReveal, useMotion } from '../lib/motion'
import { AgentHandoff, SITE_HANDOFF } from '../components/AgentHandoff'
import { PlotCanvas } from '../components/PlotCanvas'
import { PlotTable } from '../components/PlotTable'
import { usePageMeta } from '../lib/usePageMeta'

function Sample({
  title,
  library,
  props,
  note,
  children,
}: {
  title: string
  library: string
  props: string
  note: ReactNode
  children: ReactNode
}) {
  return (
    <section className="border-t border-line-soft py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-cream">{title}</h2>
        <p className="font-mono text-xs text-muted">{library}</p>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{note}</p>
      <p className="mt-3 font-mono text-xs text-pulse">{props}</p>
      <div className="mt-6 rounded-2xl border border-line bg-surface/60 p-4 sm:p-6">{children}</div>
    </section>
  )
}

const TOKENS = [
  ['ink', '#0b0a0b'],
  ['surface', '#121013'],
  ['surface-2', '#191619'],
  ['line', '#2a242a'],
  ['line-soft', '#201b20'],
  ['cream', '#d9d3c6'],
  ['muted', '#a49a9e'],
  ['pulse', '#ff2d95'],
  ['violet', '#ffc2dd'],
]

const DECLINED = [
  ['RainbowButton', 'a second primary action is a second decision to make'],
  ['GradientButton', 'the plot has one primary action; the rest are links'],
  ['BorderBeam', 'the map moves when the reader moves it, and not otherwise'],
  ['NumberTicker', 'the counts are small enough to read at rest'],
  ['Marquee', 'a moving band beside a diagram competes with it'],
  ['BentoGrid', 'three sections do not need a grid of tiles'],
]

export function Design() {
  usePageMeta(
    'Design',
    'The live design system: the components this site actually ships, with the props it actually uses.',
  )

  const { mode } = useMotion()

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-xs tracking-[0.18em] text-pulse uppercase">Design</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-cream sm:text-5xl">
        The design system is this page.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Nothing below is a screenshot. Each sample is the same import the rest of the site uses,
        with the same props. If a sample stops working, the site is wrong — which is the point of
        keeping the documentation and the demo in one file tree.
      </p>

      <div className="mt-8 rounded-xl border border-line bg-surface p-4 text-sm text-muted">
        Motion budget: <span className="font-mono text-cream">{mode}</span>. The map fits itself
        instantly in <em>still</em> and glides in <em>calm</em> and <em>full</em>. Set the level in
        the header; nothing on this site animates on its own.
      </div>

      <div className="mt-12">
        <h2 className="text-xs tracking-[0.18em] text-muted uppercase">Palette</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TOKENS.map(([name, hex]) => (
            <li key={name} className="rounded-xl border border-line bg-surface p-3">
              <span
                className="block h-10 w-full rounded-lg border border-line-soft"
                style={{ backgroundColor: hex }}
              />
              <span className="mt-2 block font-mono text-xs text-cream">{name}</span>
              <span className="block font-mono text-[11px] text-muted">{hex}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Nine tokens in <span className="font-mono">src/index.css</span>. The{' '}
          <Link to="/palette" className="text-pulse underline decoration-pulse/30 underline-offset-4">
            colour page
          </Link>{' '}
          measures the pairs rather than describing them.
        </p>
      </div>

      <div className="mt-12">
        <Sample
          title="Plot canvas"
          library="react-flow · @xyflow/react 13"
          props="nodes · edges · nodeTypes · fitView · minZoom · maxZoom · onNodeClick"
          note={
            <>
              The one page this site exists for. Two properties are deliberate: it is drawn in the
              browser only (the table below the map is the prerendered version), and it never
              animates beyond the reader's own pan and zoom. The crow&rsquo;s-foot markers are SVG
              defs referenced by id — <span className="font-mono">er-one</span>,{' '}
              <span className="font-mono">er-many</span>.
            </>
          }
        >
          <PlotCanvas />
        </Sample>

        <Sample
          title="PlotTable"
          library="this repository · components"
          props="none — rows come from src/lib/plot.ts"
          note={
            <>
              The same rows as two tables, rendered on the server. It is the accessible and
              printable version, and the one an agent gets from{' '}
              <span className="font-mono">dist/index.html</span> without running JavaScript.
            </>
          }
        >
          <PlotTable />
        </Sample>

        <Sample
          title="Button"
          library="fancy-ui-react · buttons"
          props="href · variant · onClick"
          note={
            <>
              Two variants, two actions on the homepage. The primary scrolls to the map; the
              secondary leaves the site for the starter. <span className="font-mono">href</span>{' '}
              renders an anchor, so the link works before hydration.
            </>
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button href="#design-buttons" variant="primary">
              Primary
            </Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </Sample>

        <Sample
          title="CopyButton"
          library="fancy-ui-react · actions"
          props="value · label · copiedLabel · size"
          note={
            <>
              Used for the clone command and the agent handoff. It writes to the clipboard and then
              says so — no toast, no state to wire up at the call site.
            </>
          }
        >
          <div className="flex flex-wrap items-center gap-4">
            <CopyButton value={SITE_HANDOFF} label="Copy handoff" size="sm" />
            <CopyButton value="npm run build" label="Copy build" size="sm" />
          </div>
        </Sample>

        <Sample
          title="MotionReveal"
          library="this repository · lib/motion"
          props="preset · delay · className"
          note={
            <>
              The reading guide under the map enters this way. It reads the motion budget, so a
              reader who asked for still gets the same cards without the movement. The hero is
              deliberately not a reveal: a panel that starts at zero opacity is a blank screen when
              the script never arrives.
            </>
          }
        >
          <MotionReveal preset="fade-up" delay={120} className="rounded-xl border border-line bg-surface p-5">
            <p className="text-sm text-muted">
              This block faded up once, when it entered the viewport, and will not animate again.
            </p>
          </MotionReveal>
        </Sample>

        <Sample
          title="AgentHandoff"
          library="this repository · components"
          props="instructions · title · note · size · id"
          note={
            <>
              A QR code whose payload is an instruction, not a link to the home page. The text is
              printed beside it, because a QR is not accessible on its own and a desktop reader
              cannot scan its own screen.
            </>
          }
        >
          <AgentHandoff id="handoff" instructions={SITE_HANDOFF} size={180} />
        </Sample>
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-surface/60 p-6">
        <h2 className="text-lg font-semibold text-cream">Left in the starter</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          The starter&rsquo;s catalogue is larger than this site&rsquo;s. These were available and
          not shipped — a component used once is a dependency, and a component used twice is still
          a decision. Each absence is named so the next seed does not have to guess.
        </p>
        <ul className="mt-4 divide-y divide-line-soft border-y border-line-soft">
          {DECLINED.map(([name, reason]) => (
            <li key={name} className="flex flex-wrap items-baseline gap-x-4 py-2.5 text-sm">
              <span className="w-36 font-mono text-xs text-cream">{name}</span>
              <span className="text-muted">{reason}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Page-level composites — <span className="font-mono">SeedPanel</span> and{' '}
          <span className="font-mono">PlotPanel</span> — are demonstrated by{' '}
          <Link to="/seeds/reader" className="text-pulse underline decoration-pulse/30 underline-offset-4">
            a seed page
          </Link>{' '}
          and{' '}
          <Link to="/plot/le.railhead" className="text-pulse underline decoration-pulse/30 underline-offset-4">
            a plot page
          </Link>
          , because a sample that invents its own data is the one thing this page must not do.
        </p>
      </div>
    </div>
  )
}
