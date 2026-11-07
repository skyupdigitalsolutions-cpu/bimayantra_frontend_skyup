// Development only: every Figma frame (mock data) and the screen index. Loaded lazily by App.jsx, so a production
// build never downloads the 268 prototype screens or their mock data.
import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { ALL_SCREENS } from './registry'
import ScreenIndex from './ScreenIndex'
import { REDIRECTS, isLivePath } from '../live/routes'

/** Prototype frame (mock data). Redirects to the connected page when one exists, unless ?proto=1. */
function Proto({ Component }) {
  const loc = useLocation()
  const [sp] = useSearchParams()
  const to = REDIRECTS[loc.pathname]
  if (to && sp.get('proto') !== '1') {
    const [path, q] = to.split('?')
    const merged = new URLSearchParams(q || '')
    sp.forEach((v, k) => merged.set(k, v))
    const s = merged.toString()
    return <Navigate to={`${path}${s ? `?${s}` : ''}`} replace />
  }
  return (
    <>
      <Component />
      <span className="pointer-events-none fixed bottom-3 left-3 z-[90] rounded-[10px] bg-[#fbf1e1] px-2.5 py-1 text-[11px] font-bold text-[#8a5a12] shadow">Design preview · not connected</span>
    </>
  )
}

export default function PrototypeRoutes() {
  return (
    <Routes>
      {ALL_SCREENS.map(({ id, path, Component }) => {
        // a frame whose path is now a connected page stays viewable at /proto/<id>
        const p = isLivePath(path) ? `/proto/${id}` : path
        return <Route key={id} path={p} element={<Proto Component={Component} />} />
      })}
      <Route path="/screens" element={<ScreenIndex />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}