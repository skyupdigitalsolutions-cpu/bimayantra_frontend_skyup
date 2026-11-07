import { Link } from 'react-router-dom'
import { isLivePath } from '../live/routes'
// Frames whose path is a connected page open at /proto/<id>; other frames open with ?proto=1 (no redirect).
const frameUrl = (sc) => (isLivePath(sc.path) ? `/proto/${sc.id}` : `${sc.path}?proto=1`)
import { SECTIONS, ALL_SCREENS } from './registry'

// Dev-only gallery: every Figma frame → its route. Visit /screens.
export default function ScreenIndex() {
  return (
    <div className="min-h-screen bg-panel px-10 py-10">
      <h1 className="text-[30px] font-bold tracking-[-0.6px] text-ink">Bimayantra — all screens</h1>
      <p className="mt-1 text-[14px] font-medium text-muted">{ALL_SCREENS.length} screens implemented from the Figma file</p>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-[28px] bg-white p-6 drop-shadow-[0px_8px_12px_rgba(19,41,75,0.05)]">
            <h2 className="text-[17px] font-bold text-ink">{s.title} <span className="text-muted">· {s.screens.length}</span></h2>
            <ul className="mt-3 flex flex-col">
              {s.screens.map((sc) => (
                <li key={sc.id}>
                  <Link to={frameUrl(sc)} className="flex items-center justify-between rounded-[12px] px-3 py-2 text-[13px] font-semibold text-ink-2 hover:bg-panel">
                    <span>{sc.name}</span>
                    <span className="font-medium text-faint">{sc.path}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}