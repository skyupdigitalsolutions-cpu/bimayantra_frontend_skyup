// Live sign-in and sign-up (P-01, P-02) built from the Figma frames:
//   A1 mobile number → 00 enter the code (A2 wrong/expired inline) → A3 locked · A5 suspended · A6 closed
//   A4 start free trial → 00 enter the code
// The static frames stay at /x/a1… for design reference; this component serves /login and /signup.
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { AuthShell, AuthButton, OtpInput, StepChip, StatusHead } from './_parts'
import { AuthField, Note } from '../states-account/_parts'
import { api } from '../../api'
import { cleanMobile, fmtMobile } from '../../api/format'
import { useAuth, homeFor, FullPageSpinner } from '../../auth/AuthProvider'
import { useToast } from '../../components/LiveToast'

/** The API says how long the code is (CFG-01, 4–8 digits) in every send response: codeLength. */
const blank = (n = 6) => Array.from({ length: n }, () => '')
const SUPPORT = 'support@bimayantra.in'

export default function LiveLogin({ mode = 'login' }) {
  const { user, signedIn, endedMessage, clearEndedMessage } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const loc = useLocation()
  const [step, setStep] = useState(mode === 'signup' ? 'signup' : 'mobile')
  const [mobile, setMobile] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)
  const [code, setCode] = useState(blank())
  const [secs, setSecs] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null) // { message, field?, code }
  const [sentInfo, setSentInfo] = useState(null)
  const [blocked, setBlocked] = useState(null) // { kind: locked|suspended|closed|other, message }
  const flow = mode === 'signup' ? 'register' : 'login'

  useEffect(() => { setStep(mode === 'signup' ? 'signup' : 'mobile'); setErr(null) }, [mode])
  useEffect(() => {
    if (secs <= 0) return
    const t = setTimeout(() => setSecs((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secs])

  if (user === undefined) return <FullPageSpinner />
  if (user) return <NavigateHome to={loc.state?.from || homeFor(user)} />

  const refusal = (e) => {
    if (e.is('OTP_LOCKED', 'OTP_SEND_LIMIT')) return setBlocked({ kind: 'locked', message: e.message })
    if (e.is('ACCOUNT_SUSPENDED')) return setBlocked({ kind: 'suspended', message: e.message })
    if (e.is('ACCOUNT_CLOSED')) return setBlocked({ kind: 'closed', message: e.message })
    if (e.is('USER_DISABLED', 'INVITE_EXPIRED')) return setBlocked({ kind: 'other', message: e.message })
    return false
  }

  const sendCode = async (e) => {
    e?.preventDefault()
    setErr(null)
    clearEndedMessage()
    const m = cleanMobile(mobile)
    if (flow === 'register' && !agree) return setErr({ message: 'Accept the Terms and Privacy policy to continue.', field: 'termsAccepted' })
    setBusy(true)
    try {
      const { data } = flow === 'register'
        ? await api.auth.registerOtp({ name: name.trim(), mobile: m, email: email.trim() || null, termsAccepted: true })
        : await api.auth.loginOtp({ mobile: m })
      setSentInfo(data)
      setSecs(data.resendAfterSeconds || 30)
      setCode(blank(data.codeLength))
      setStep('otp')
      if (!data.sent && data.message) toast(data.message)
    } catch (e2) {
      if (!refusal(e2)) setErr({ message: e2.fields?.[0]?.message || e2.message, field: e2.fields?.[0]?.field, code: e2.code })
    } finally {
      setBusy(false)
    }
  }

  const verify = async (e) => {
    e?.preventDefault()
    if (!code.every(Boolean)) return
    setErr(null)
    setBusy(true)
    try {
      const body = { mobile: cleanMobile(mobile), code: code.join('') }
      const res = flow === 'register' ? await api.auth.registerVerify(body) : await api.auth.loginVerify(body)
      const u = await signedIn(res.data)
      if (res.meta?.message) toast(res.meta.message)
      res.data.notices?.forEach((n) => toast(n.message, 'error', 9000))
      navigate(loc.state?.from || homeFor(u), { replace: true })
    } catch (e2) {
      if (!refusal(e2)) {
        setErr({ message: e2.message, code: e2.code })
        if (e2.is('OTP_INCORRECT')) setCode(code) // keep the digits red (A2)
      }
    } finally {
      setBusy(false)
    }
  }

  /* ── A3 / A5 / A6 ── */
  if (blocked) {
    const head = {
      locked: { icon: 'lock', circle: 'bg-[#fbebec] text-[#b4323c]', title: 'Too many wrong codes' },
      suspended: { icon: 'alert', circle: 'bg-[#fbf1e1] text-[#8a5a12]', title: 'Your account is suspended' },
      closed: { icon: 'x', circle: 'bg-[#eef1f5] text-ink-2', title: 'This account is closed' },
      other: { icon: 'lock', circle: 'bg-[#eef1f5] text-ink-2', title: 'You can’t sign in' },
    }[blocked.kind]
    return (
      <AuthShell>
        <StatusHead {...head}>{blocked.message}</StatusHead>
        {blocked.kind === 'locked' || blocked.kind === 'other' ? (
          <AuthButton variant="secondary" className="mt-6 px-5" onClick={() => { setBlocked(null); setStep(mode === 'signup' ? 'signup' : 'mobile') }}>Back to log in</AuthButton>
        ) : (
          <AuthButton as="a" href={`mailto:${SUPPORT}`} icon="chat" variant={blocked.kind === 'closed' ? 'secondary' : 'primary'} className="mt-6">Contact SkyUp support</AuthButton>
        )}
      </AuthShell>
    )
  }

  /* ── 00 · Enter the code (A2 inline) ── */
  if (step === 'otp') {
    const wrong = err && (err.code === 'OTP_INCORRECT' || err.code === 'OTP_EXPIRED')
    return (
      <AuthShell onSubmit={verify}>
        <StepChip>Step 2 of 2</StepChip>
        <h2 className="mt-[18px] text-[38px] font-bold tracking-[-0.76px] text-ink">Enter the code</h2>
        <p className="mt-2 text-[15px] font-medium text-muted">{sentInfo?.message || `We sent a ${code.length}-digit OTP by SMS.`}</p>
        <div className="mt-7 flex w-full items-center gap-3 rounded-[20px] bg-panel px-[18px] py-3.5">
          <Icon name="phone" size={18} className="text-ink" />
          <p className="flex-1 text-[15px] font-semibold text-ink">+91 {fmtMobile(mobile)}</p>
          <button type="button" onClick={() => { setStep(mode === 'signup' ? 'signup' : 'mobile'); setErr(null) }} className="text-[13px] font-semibold text-blue hover:underline">Change</button>
        </div>
        {err && <Note icon="alert" className="mt-4 w-[440px] bg-[#fbebec] text-[#b4323c]">{err.message}</Note>}
        <div className="mt-6"><OtpInput key={code.length} length={code.length} value={code} onChange={(v) => { setCode(v); if (err) setErr(null) }} error={!!wrong} /></div>
        <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-muted">
          <Icon name="clock" size={16} />
          {secs > 0 ? (
            <span>Resend code in {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}</span>
          ) : (
            <button type="button" disabled={busy} onClick={sendCode} className="font-semibold text-blue hover:underline">Resend code</button>
          )}
          {import.meta.env.DEV && <DevOtp mobile={mobile} length={code.length} onCode={setCode} />}
        </div>
        <button type="submit" disabled={!code.every(Boolean) || busy}
          className="mt-7 flex h-[46px] w-full items-center justify-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white shadow-navy transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-70">
          <Icon name="arrow" size={18} />
          {busy ? 'Verifying…' : 'Verify and continue'}
        </button>
        <p className="mt-[18px] w-[440px] text-[12px] leading-[18px] font-medium text-muted">Too many wrong codes lock the number for a while. Each new code replaces the last one.</p>
      </AuthShell>
    )
  }

  /* ── A4 · Sign up ── */
  if (step === 'signup') {
    return (
      <AuthShell onSubmit={sendCode}>
        <StepChip tone="green" icon="star">Free trial · Normal plan</StepChip>
        <h2 className="mt-[18px] text-[34px] font-bold tracking-[-0.7px] text-ink">Create your account</h2>
        <p className="mt-2 text-[15px] font-medium text-muted">Full access during the trial. No card needed.</p>
        {err && <Note icon="alert" className="mt-4 w-[440px] bg-[#fbebec] text-[#b4323c]">{err.message}</Note>}
        <AuthField className="mt-6" label="Full name *" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <AuthField className="mt-3" label="Mobile number *" prefix="+91" inputMode="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <AuthField className="mt-3" label="Email" leading="mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="button" onClick={() => setAgree(!agree)} className="mt-3 flex items-center gap-2.5 text-[13px] font-semibold text-ink">
          <span className={cx('flex size-[22px] items-center justify-center rounded-[7px]', agree ? 'bg-navy text-white' : 'border-[1.5px] border-line bg-white', err?.field === 'termsAccepted' && 'border-[#b4323c]')}>
            {agree && <Icon name="check" size={14} />}
          </span>
          I agree to the Terms and Privacy policy.
        </button>
        <AuthButton type="submit" icon="arrow" className="mt-5" disabled={busy}>{busy ? 'Sending…' : 'Send OTP and start trial'}</AuthButton>
        <p className="mt-6 flex gap-1.5 text-[14px]">
          <span className="font-medium text-muted">Already have an account?</span>
          <Link to="/login" className="font-bold text-blue hover:underline">Log in</Link>
        </p>
      </AuthShell>
    )
  }

  /* ── A1 · Mobile number ── */
  return (
    <AuthShell onSubmit={sendCode}>
      <StepChip>Step 1 of 2</StepChip>
      <h2 className="mt-[18px] text-[38px] font-bold tracking-[-0.8px] text-ink">Log in</h2>
      <p className="mt-2 text-[15px] font-medium text-muted">We’ll send a 6-digit code by SMS. No password needed.</p>
      {endedMessage && <Note icon="clock" className="mt-4 w-[440px] bg-blue-50 text-blue">{endedMessage}</Note>}
      {err && (
        <Note icon="alert" className="mt-4 w-[440px] bg-[#fbebec] text-[#b4323c]">
          <span>{err.message}{err.code === 'MOBILE_NOT_REGISTERED' && <> <Link to="/signup" className="underline">Start a free trial</Link></>}</span>
        </Note>
      )}
      <AuthField className="mt-7" label="Mobile number *" prefix="+91" focus autoFocus inputMode="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
      <AuthButton type="submit" icon="send" className="mt-6" disabled={busy || cleanMobile(mobile).length !== 10}>{busy ? 'Sending…' : 'Send OTP'}</AuthButton>
      <p className="mt-6 flex gap-1.5 text-[14px]">
        <span className="font-medium text-muted">New to Bimayantra?</span>
        <Link to="/signup" className="font-bold text-blue hover:underline">Start your free trial</Link>
      </p>
    </AuthShell>
  )
}

function NavigateHome({ to }) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace: true }) }, [navigate, to])
  return <FullPageSpinner />
}

/** Development only: read the OTP from the API's test SMS inbox (SMS_PROVIDER=dev, DEV_TOOLS=true). */
function DevOtp({ mobile, length, onCode }) {
  const [note, setNote] = useState('')
  const fill = async () => {
    try {
      const { data } = await api.dev.sms(cleanMobile(mobile))
      const list = data?.messages || []
      const last = list[0] // newest first (LPUSH)
      const m = new RegExp('(?:^|[^0-9])([0-9]{' + length + '})(?![0-9])').exec(last?.text || last?.body || '')
      if (m) onCode(m[1].split(''))
      else setNote('No code in the test inbox')
    } catch {
      setNote('Test inbox unavailable')
    }
  }
  return (
    <span className="ml-auto flex items-center gap-2">
      {note && <span className="text-[11px]">{note}</span>}
      <button type="button" onClick={fill} className="rounded-[10px] bg-chip px-2 py-1 text-[11px] font-semibold text-muted hover:text-ink">Dev: fill OTP</button>
    </span>
  )
}