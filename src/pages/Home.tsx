import { Link } from 'react-router-dom'
import { Button, CopyButton } from 'fancy-ui-react'
import { PAGES } from '../lib/content'
import { PLOT, children } from '../lib/plot'
import { PARENT } from '../lib/site'
import { MotionReveal } from '../lib/motion'
import { PlotCanvas } from '../components/PlotCanvas'
import { PlotTable } from '../components/PlotTable'
import { usePageMeta } from '../lib/usePageMeta'

const CLONE = `git clone ${PARENT.repo}.git my-site\ncd my-site && npm install && npm run dev`

const FACTS = [
  { k: 'Seeds', v: String(PLOT.length) },
  { k: 'Grown from one', v: String(children().length) },
  { k: 'Relationships', v: String(children().length + 2) },
  { k: 'Pages', v: String(PAGES.length) },
]

export function Home() {
  usePageMeta(
    undefined,
    'One page, five tables: every site grown from le.gume, what each kept, and what each added.',
  )

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
                arrives. Motion is for the card beside it. */}
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs tracking-wide text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-pulse" />
              le.plot · the seed plot
            </p>

            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-cream sm:text-6xl">
              Five seeds,
              <br />
              one <span className="text-pulse">starter</span>.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Every site grown from <span className="font-mono text-cream">le.gume</span>, drawn as
              entity tables on one page. Each table is a seed; each line is a relationship you can
              check in the repository, not a claim about one.
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
          {FACTS.map((fact) => (
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
              Five tables and six lines. Solid lines are inheritance; dashed lines are a vendored
              copy of the parent&rsquo;s rules, carrying the version it was taken at. Select a table
              to read its row without leaving the page.
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
          <PlotCanvas />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-4 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
          The same rows, as a table
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Printed in the static page, so a reader without JavaScript — or an agent reading the
          build — gets the values rather than an empty canvas.
        </p>
        <div className="mt-6">
          <PlotTable />
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
              <span className="text-cream">PK</span> is the seed&rsquo;s own key: its name is its
              route and its URL. <span className="text-cream">FK</span> is the seed it was grown
              from. There is one null foreign key on the page, and it belongs to the starter.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-mono text-xs text-pulse">rung</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              How much of the machine the front door assumes. A rung-0 reader wants a website and a
              bill; a rung-4 reader designs systems other people run. Readiness, not seniority.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-mono text-xs text-pulse">one · many</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              The bar sits at the parent end, the fork at the child end: one starter, many children.
              A dashed line does not add a second parent — it records a second claim about the same
              two rows.
            </p>
          </div>
        </MotionReveal>
      </section>
    </>
  )
}
