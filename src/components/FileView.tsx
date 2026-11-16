import type { Page } from '../lib/content'
import { useFileView } from '../lib/fileview'

/**
 * The page as a file. No panel, no table of contents, no previous/next — those
 * are renderings, and this view exists to show the thing they are renderings of.
 */
export function FileView({ page }: { page: Page }) {
  const { setView } = useFileView()

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="sr-only">{page.title} — source file</h1>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-xs text-muted">
          src/content/{page.path}.md · {page.raw.length} bytes
        </p>
        <button
          type="button"
          onClick={() => setView('page')}
          className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-pulse/50 hover:text-cream"
        >
          render it
        </button>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-[#0c0a0c] p-4 font-mono text-[12px] leading-6 whitespace-pre-wrap text-cream/85">
        {page.raw}
      </pre>
    </div>
  )
}
