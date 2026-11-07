// Figma 281:26934 · A1 · Login — Mobile number
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell, AuthButton, StepChip } from '../auth/_parts'
import { AuthField } from './_parts'
import { account } from '../../data/states-account'

export default function A1LoginMobileNumber() {
  const navigate = useNavigate()
  const [mobile, setMobile] = useState(account.mobile)
  return (
    <AuthShell onSubmit={(e) => { e.preventDefault(); navigate('/login') }}>
      <StepChip>Step 1 of 2</StepChip>
      <h2 className="mt-[18px] text-[38px] font-bold tracking-[-0.8px] text-ink">Log in</h2>
      <p className="mt-2 text-[15px] font-medium text-muted">We’ll send a 6-digit code by SMS. No password needed.</p>
      <AuthField className="mt-7" label="Mobile number *" prefix="+91" focus autoFocus inputMode="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
      <AuthButton type="submit" icon="send" className="mt-6">Send OTP</AuthButton>
      <p className="mt-6 flex gap-1.5 text-[14px]">
        <span className="font-medium text-muted">New to Bimayantra?</span>
        <Link to="/x/a4-sign-up-start-free-trial" className="font-bold text-blue hover:underline">Start your free trial</Link>
      </p>
    </AuthShell>
  )
}
