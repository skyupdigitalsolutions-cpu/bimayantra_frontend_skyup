// Figma 281:27273 · A4 · Sign up — Start free trial
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { AuthShell, AuthButton, StepChip } from '../auth/_parts'
import { AuthField } from './_parts'
import { account } from '../../data/states-account'

export default function A4SignUpStartFreeTrial() {
  const navigate = useNavigate()
  const [f, setF] = useState({ name: account.name, mobile: account.mobile, email: account.email })
  const [agree, setAgree] = useState(true)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <AuthShell onSubmit={(e) => { e.preventDefault(); if (agree) navigate('/login') }}>
      <StepChip tone="green" icon="star">14-day free trial · Normal plan</StepChip>
      <h2 className="mt-[18px] text-[34px] font-bold tracking-[-0.7px] text-ink">Create your account</h2>
      <p className="mt-2 text-[15px] font-medium text-muted">Full access during the trial. No card needed.</p>
      <AuthField className="mt-6" label="Full name *" value={f.name} onChange={set('name')} />
      <AuthField className="mt-3" label="Mobile number *" prefix="+91" inputMode="tel" value={f.mobile} onChange={set('mobile')} />
      <AuthField className="mt-3" label="Email *" leading="mail" type="email" value={f.email} onChange={set('email')} />
      <button type="button" onClick={() => setAgree(!agree)} className="mt-3 flex items-center gap-2.5 text-[13px] font-semibold text-ink">
        <span className={cx('flex size-[22px] items-center justify-center rounded-[7px]', agree ? 'bg-navy text-white' : 'border-[1.5px] border-line bg-white')}>
          {agree && <Icon name="check" size={14} />}
        </span>
        I agree to the Terms and Privacy policy.
      </button>
      <AuthButton type="submit" icon="arrow" className="mt-5">Send OTP and start trial</AuthButton>
    </AuthShell>
  )
}
