// Figma 8:389 · 00 · Login (OTP)
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { AuthShell, OtpInput } from './_parts'
import { loginMobile, otpPrefill, resendSeconds } from '../../data/auth'

export default function Login() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(otpPrefill)
  const [secs, setSecs] = useState(resendSeconds)
  const complete = otp.every(Boolean)

  useEffect(() => {
    if (secs <= 0) return
    const t = setTimeout(() => setSecs((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secs])

  const verify = (e) => {
    e.preventDefault()
    if (complete) navigate('/')
  }

  return (
    <AuthShell onSubmit={verify}>
          <span className="rounded-[14px] bg-violet-50 px-3 py-[5px] text-[12px] font-semibold text-violet">Step 2 of 2</span>
          <h2 className="mt-[18px] text-[38px] font-bold tracking-[-0.76px] text-ink">Enter the code</h2>
          <p className="mt-2 text-[15px] font-medium text-muted">We sent a 6-digit OTP by SMS.</p>

          <div className="mt-7 flex w-full items-center gap-3 rounded-[20px] bg-panel px-[18px] py-3.5">
            <Icon name="phone" size={18} className="text-ink" />
            <p className="flex-1 text-[15px] font-semibold text-ink">{loginMobile}</p>
            <Link to="/x/a1-login-mobile-number" className="text-[13px] font-semibold text-blue hover:underline">Change</Link>
          </div>

          <div className="mt-6">
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-muted">
            <Icon name="clock" size={16} />
            {secs > 0 ? (
              <span>Resend code in 0:{String(secs).padStart(2, '0')}</span>
            ) : (
              <button type="button" onClick={() => setSecs(resendSeconds)} className="font-semibold text-blue hover:underline">Resend code</button>
            )}
          </div>

          <button
            type="submit"
            disabled={!complete}
            className="mt-7 flex h-[46px] w-full items-center justify-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white shadow-navy transition hover:bg-navy-700 disabled:cursor-not-allowed"
          >
            <Icon name="arrow" size={18} />
            Verify and continue
          </button>

          <p className="mt-[18px] w-[440px] text-[12px] leading-[18px] font-medium text-muted">
            Too many wrong codes lock the number for a while. Each new code replaces the last one.
          </p>
          <div className="mt-8 h-px w-[440px] bg-line" />
          <p className="mt-6 flex gap-1.5 text-[14px]">
            <span className="font-medium text-muted">New to Bimayantra?</span>
            <Link to="/x/a4-sign-up-start-free-trial" className="font-bold text-blue hover:underline">Start your free trial</Link>
          </p>
    </AuthShell>
  )
}
