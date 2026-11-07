// Signed-in user, feature switches and reference lists for the whole app (P-02, P-03).
// • On load: GET /auth/me (cookie session). 401 → signed out.
// • After sign-in: GET /flags and GET /reference (lists the screens use: lead sources, lost reasons, …).
// • Any later 401 (session ended elsewhere, idle timeout) → back to /login with the server's message.
// • 403 STEP_UP_REQUIRED anywhere → the OTP dialog below, then the request is repeated.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { api, onSessionEnded, setStepUpHandler } from '../api'
import { Modal } from '../components/ui'
import { OtpInput } from '../screens/auth/_parts'
import { useToast } from '../components/LiveToast'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

/** Where each role lands after sign-in. */
export function homeFor(user) {
  if (!user) return '/login'
  if (user.role === 'ADM' || user.role === 'STF') return '/admin'
  if (user.role === 'REF') return '/referrer'
  return '/'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = checking, null = signed out
  const [flags, setFlags] = useState({})
  const [reference, setReference] = useState(null)
  const [endedMessage, setEndedMessage] = useState(null)
  const navigate = useNavigate()

  const loadExtras = useCallback(async () => {
    const [f, r] = await Promise.allSettled([api.flags.mine(), api.reference.get()])
    if (f.status === 'fulfilled') setFlags(f.value.data || {})
    if (r.status === 'fulfilled') setReference(r.value.data)
  }, [])

  const refreshMe = useCallback(async () => {
    try {
      const { data } = await api.auth.me()
      setUser(data)
      return data
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    refreshMe().then((u) => u && loadExtras())
    // reference lists are public: load them for the sign-up form too
    api.reference.get().then((r) => setReference(r.data)).catch(() => {})
  }, [refreshMe, loadExtras])

  useEffect(() => onSessionEnded((err) => {
    setUser((u) => {
      if (u) {
        setEndedMessage(err?.message || 'Your session has ended. Please log in again.')
        navigate('/login', { replace: true })
      }
      return null
    })
  }), [navigate])

  /** Called by the login / sign-up screens with the verify response { user, notices } */
  const signedIn = useCallback(async (data) => {
    setEndedMessage(null)
    setUser(data.user)
    await loadExtras()
    return data.user
  }, [loadExtras])

  const logout = useCallback(async () => {
    try { await api.auth.logout() } catch { /* cookies are cleared either way */ }
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const can = useCallback((capability) => !!user?.capabilities?.includes(capability), [user])

  const value = useMemo(
    () => ({ user, flags, reference, signedIn, logout, refreshMe, can, endedMessage, clearEndedMessage: () => setEndedMessage(null) }),
    [user, flags, reference, signedIn, logout, refreshMe, can, endedMessage],
  )
  return (
    <AuthCtx.Provider value={value}>
      {children}
      <StepUpDialog />
    </AuthCtx.Provider>
  )
}

/** Route guard. `roles` limits who may open the page (e.g. ['ADM','STF'] for SkyUp admin). */
export function RequireAuth({ children, roles }) {
  const { user } = useAuth()
  const loc = useLocation()
  if (user === undefined) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />
  if (roles && !roles.includes(user.role)) return <Navigate to={homeFor(user)} replace />
  return children
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <span className="size-10 animate-spin rounded-full border-4 border-panel border-t-navy" aria-label="Loading" />
    </div>
  )
}

/* ───────── Step-up OTP (CFG-83) ───────── */
function StepUpDialog() {
  const [open, setOpen] = useState(null) // { message, resolve }
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const blank = (n) => Array.from({ length: n || 6 }, () => '')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const pending = useRef(null)
  const { toastError } = useToast()

  useEffect(() => {
    setStepUpHandler(async (err) => {
      let sent
      try { sent = (await api.auth.stepUpOtp()).data } catch (e) { toastError(e); return null }
      return new Promise((resolve) => {
        pending.current = resolve
        setCode(blank(sent?.codeLength)) // CFG-01: the API says how many digits
        setError(null)
        setOpen({ message: err.message })
      })
    })
    return () => setStepUpHandler(null)
  }, [toastError])

  if (!open) return null
  const close = (token) => { pending.current?.(token); pending.current = null; setOpen(null) }
  const verify = async () => {
    setBusy(true)
    setError(null)
    try {
      const { data } = await api.auth.stepUpVerify(code.join(''))
      close(data.stepUpToken)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal onClose={() => close(null)} width={520}>
      <p className="text-[21px] font-bold text-ink">Confirm it is you</p>
      <p className="mt-2 text-[13px] leading-5 font-medium text-muted">{open.message}</p>
      <div className="mt-5"><OtpInput key={code.length} length={code.length} value={code} onChange={setCode} error={!!error} /></div>
      {error && <p className="mt-3 text-[13px] font-semibold text-[#b4323c]">{error}</p>}
      <div className="mt-6 flex gap-2.5">
        <button type="button" onClick={() => close(null)} className="flex h-[46px] flex-1 items-center justify-center rounded-[24px] border border-line text-[14px] font-semibold text-ink hover:bg-tile">Cancel</button>
        <button type="button" disabled={busy || !code.every(Boolean)} onClick={verify} className="flex h-[46px] flex-1 items-center justify-center rounded-[24px] bg-navy text-[14px] font-semibold text-white disabled:opacity-50">Verify and continue</button>
      </div>
    </Modal>
  )
}