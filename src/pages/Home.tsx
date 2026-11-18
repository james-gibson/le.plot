import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, CopyButton } from 'fancy-ui-react'
import { PAGES } from '../lib/content'
import { ALL_GROUPS, GROUPS, PLOT, RELATIONS, children, parts, seeds, type GroupId } from '../lib/plot'
import { PARENT } from '../lib/site'
import { MotionReveal } from '../lib/motion'
import { PlotCanvas } from '../components/PlotCanvas'
import { PlotTable } from '../components/PlotTable'
import { usePageMeta } from '../lib/usePageMeta'

const CLONE = `git clone ${PARENT.repo}.git my-site\ncd my-site && npm install && npm run dev`

const countIn = (group: GroupId) => PLOT.filter((row) => row.group === group).length

/** A view can be linked: `?view=lab` or `?view=examples,docs`. Unknown ids are ignored. */
function parseView(value: string | null): GroupId[] {
  if (!value) return ALL_GROUPS
  const wanted = value
    .split(',')
    .map((part) => part.trim())
    .filter((part): part is GroupId => ALL_GROUPS.includes(part as GroupId))
  return wanted.length ? wanted : ALL_GROUPS
}

export function Home() {
  usePageMeta(
    undefined,
    'One page, twenty-eight tables: the sites grown from le.gume, the lab they run in, and the tools that read and write them.',
  )

  const [params, setParams] = useSearchParams()
  const [groups, setGroups] = useState<GroupId[]>(() => {
    if (params.get('view')) return parseView(params.get('view'))
    // A phone cannot read 26 tables in one frame, and the whole map is not the
    // useful first question there. Open on the deployments; Everything is one
    // tap away. Desktop opens on everything, which is the agent's view.
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      return ['examples']
    }
    return ALL_GROUPS
  })
  const [picked, setPicked] = useState<string | null>(null)

  // The URL is the shareable state: a view that cannot be linked dies with the tab.
  useEffect(() => {
    const current = parseView(params.get('view'))
    const same = current.length === groups.length && current.every((id) => groups.includes(id))
    if (same) return
    setParams(
      groups.length === ALL_GROUPS.length ? {} : { view: groups.join(',') },
      { replace: true },
    )
  }, [groups, params, setParams])

  const toggle = (group: GroupId) => {
    setGroups((current) => {
      const next = current.includes(group) ? current.filter((id) => id !== group) : [...current, group]
      // An empty map is a worse answer than the whole one.
      return next.length ? next : ALL_GROUPS
    })
    setPicked(null)
  }

  const facts = [
    { k: 'Systems', v: String(PLOT.length) },
    { k: 'Deployments', v: String(countIn('examples')) },
    { k: 'In the lab', v: String(countIn('lab')) },
    { k: 'Reading tools', v: String(countIn('docs')) },
  ]

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/70">
        <div className="plot-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* min-w-0 on both columns: the clone command is a <pre>, and a grid
              item's automatic minimum size would otherwise widen the page past
              the viewport on a phone instead of letting the command scroll. */}
          <div className="min-w-0">
            {/* The hero is not wrapped in MotionReveal on purpose: it is the
                first thing a reader without JavaScript should see, and a reveal
                that starts at opacity 0 is a blank screen when the script never
                arrives. Motion is for the reading guide below the map. */}
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs tracking-wide text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-pulse" />
              le.plot · the plot
            </p>

            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-cream sm:text-6xl">
              One starter,
              <br />
              <span className="text-pulse">twenty-eight</span> systems.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Every site grown from <span className="font-mono text-cream">le.gume</span>, the lab
              those sites describe, and the tools that read and write them — drawn as entity tables
              on one page. Toggle a layer to answer one question at a time.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#map" variant="primary">
                Read the plot
              </Button>
              <Button href={`${PARENT.origin}/`} variant="secondary">
                Open the starter
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted">
              No account, no tracker, no query. The map is a build artifact.
            </p>
          </div>

          <div className="min-w-0">
            <div className="rounded-2xl border border-line bg-surface/90 p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs tracking-[0.16em] text-muted uppercase">Grow one</p>
                <CopyButton value={CLONE} label="Copy" copiedLabel="Copied" size="sm" />
              </div>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-line-soft bg-[#0c0a0c] p-4 font-mono text-[12px] leading-6 whitespace-pre-wrap break-words text-cream/90">
                <code>{CLONE}</code>
              </pre>
              <p className="mt-4 text-sm leading-6 text-muted">
                The clone is the whole distribution. There is no generator to trust, and no version
                of the template hidden inside a package you did not read.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line/70 bg-surface/30">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 sm:px-8">
          {facts.map((fact) => (
            <div key={fact.k}>
              <p className="font-mono text-2xl font-semibold text-cream sm:text-3xl">{fact.v}</p>
              <p className="mt-1 text-xs tracking-[0.14em] text-muted uppercase">{fact.k}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="map" className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
              The plot, in one page
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              {PLOT.length} tables and {children().length + children().filter((seed) => seed.vendors).length + RELATIONS.length}{' '}
              lines, in three layers. Solid lines are inheritance; dashed lines are a vendored copy
              of the parent&rsquo;s rules, carrying the version it was taken at; the thin lines are a
              claim a row states in full on its page.
            </p>
          </div>
          <Link
            to="/docs/data-model"
            className="text-sm text-pulse underline decoration-pulse/30 underline-offset-4 hover:decoration-pulse"
          >
            How the map is built
          </Link>
        </div>

        <div className="mt-8">
          <PlotCanvas
            groups={groups}
            onToggle={toggle}
            onAll={() => {
              setGroups(ALL_GROUPS)
              setPicked(null)
            }}
            picked={picked}
            onPick={setPicked}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-4 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
          The same rows, as tables
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Printed in the static page and filtered by the same switches, so a reader without
          JavaScript — or an agent reading the build — gets the values rather than an empty canvas.
          The lab table&rsquo;s <span className="font-mono">ports</span> column is the default each
          one binds when nothing overrides it.
        </p>
        <div className="mt-6">
          <PlotTable groups={groups} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
        <h2 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
          How to read a table
        </h2>
        <MotionReveal preset="fade-up" className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-mono text-xs text-pulse">PK · FK</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              <span className="text-cream">PK</span> is the row&rsquo;s own key: its name is its
              route and its URL. <span className="text-cream">FK</span> is the row it was grown
              from. The foreign key is null on the starter and on every row that was not grown from
              it.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-mono text-xs text-pulse">rung · kind</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              A seed row carries a <span className="text-cream">rung</span>: how much of the machine
              its front door assumes. A part row carries a{' '}
              <span className="text-cream">kind</span> (library, tool, app, upstream, package,
              workspace) and a <span className="text-cream">language</span>.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-mono text-xs text-pulse">the layers</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              <span className="text-cream">Deployments</span> are the sites you can open;{' '}
              <span className="text-cream">the lab</span> is what runs on this machine;{' '}
              <span className="text-cream">reading &amp; writing</span> is the tooling around the
              documents. <span className="text-cream">Everything</span> is all three, which is the
              view an agent wants.
            </p>
          </div>
        </MotionReveal>
        <p className="mt-6 text-sm text-muted">
          {seeds().length} seed rows, {parts().length} part rows, {GROUPS.length} layers, {PAGES.length}{' '}
          pages.
        </p>
      </section>
    </>
  )
}
