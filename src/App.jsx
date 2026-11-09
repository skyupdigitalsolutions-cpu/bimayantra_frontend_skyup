import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NavBehavior from './components/NavBehavior'
import GlobalSearch from './components/GlobalSearch'
import { ToastProvider } from './components/LiveToast'
import { AuthProvider, RequireAuth, FullPageSpinner } from './auth/AuthProvider'
import { LIVE_ROUTES, PUBLIC_ROUTES, REDIRECTS } from './live/routes'

/**
 * Figma frames (mock data) are a design tool, not part of the product. They are mounted only in development
 * (npm run dev) or when VITE_SHOW_PROTOTYPES=true, and loaded lazily: a production build never downloads them and
 * never renders mock data — every old frame link goes to its connected page, or to the dashboard.
 */
const SHOW_PROTOTYPES = import.meta.env.DEV || import.meta.env.VITE_SHOW_PROTOTYPES === 'true'
const PrototypeRoutes = SHOW_PROTOTYPES ? lazy(() => import('./screens/PrototypeRoutes')) : null

/** Production: an old frame link goes to its connected page, or home. */
function FrameRedirect() {
  const loc = useLocation()
  return <Navigate to={REDIRECTS[loc.pathname] ?? '/'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <NavBehavior />
          <GlobalSearch />
          <Routes>
            {PUBLIC_ROUTES.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
            {LIVE_ROUTES.map((r) => <Route key={r.path} path={r.path} element={<RequireAuth roles={r.roles}>{r.element}</RequireAuth>} />)}
            {PrototypeRoutes
              ? <Route path="*" element={<Suspense fallback={<FullPageSpinner />}><PrototypeRoutes /></Suspense>} />
              : <><Route path="/x/*" element={<FrameRedirect />} /><Route path="*" element={<Navigate to="/" replace />} /></>}
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}