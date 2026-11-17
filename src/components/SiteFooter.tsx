import { Link } from 'react-router-dom'
import { AgentCta } from './AgentCta'
import { HiddenNote } from './HiddenNote'
import { PAGES, SECTIONS } from '../lib/content'
import { PARENT, REPO_URL, SITE } from '../lib/site'

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line/80 bg-surface/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-sm font-semibold text-cream">
            {SITE.split('.').map((part, i) => (
              <span key={part}>
                {i > 0 && <span className="text-pulse">.</span>}
                {part}
              </span>
            ))}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            Thirteen systems, one plot, drawn as tables. Grown from{' '}
            <a
              href={`${PARENT.origin}/`}
              className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
            >
              {PARENT.name}
            </a>
            ; every page here is checkable against the repository it describes.
          </p>
          <p className="mt-4 font-mono text-xs text-muted">{PAGES.length} pages · {SECTIONS.length} sections · 1 build</p>
        </div>

        {SECTIONS.slice(0, 3).map((section) => (
          <div key={section.id}>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">{section.label}</p>
            <ul className="mt-3 space-y-2">
              {PAGES.filter((p) => p.section === section.id)
                .slice(0, 4)
                .map((page) => (
                  <li key={page.path}>
                    <Link
                      to={`/${page.section}/${page.slug}`}
                      className="text-sm text-muted transition-colors hover:text-cream"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <HiddenNote title="a map is not a census">
          <p>
            The plot lists the seeds this repository could find, read and check. A seed that was
            cloned and never published, or published under another account, is not on it — and the
            absence is not a judgement. The record is the list.
          </p>
          <p>
            If a row here is wrong, the fix is a commit, not a comment: the row lives in{' '}
            <span className="font-mono">src/lib/plot.ts</span> beside the page it describes.
          </p>
        </HiddenNote>
      </div>

      <AgentCta />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 border-t border-line-soft px-5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          React, Vite and Tailwind. The map is{' '}
          <a
            href="https://reactflow.dev"
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
          >
            React Flow
          </a>
          ; the handoff and motion are{' '}
          <a
            href="https://fancy-ui.rama.app"
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted underline decoration-line underline-offset-4 hover:text-cream"
          >
            fancy-ui
          </a>
          .
        </p>
        <p className="font-mono">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-cream"
          >
            james-gibson/le.plot
          </a>{' '}
          · AGPL-3.0 ·{' '}
          <Link to="/design#handoff" className="hover:text-cream">
            take it with you
          </Link>
        </p>
      </div>
    </footer>
  )
}
