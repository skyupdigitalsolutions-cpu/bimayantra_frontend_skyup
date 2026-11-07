// A7–A9 · Subscription banner on every signed-in page. The API decides when it shows and words it
// (GET /auth/me → subscription.banner: TRIAL SUB-04, GRACE SUB-05, EXPIRED / read-only SUB-03).
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { cx } from './ui'
import { useAuth } from '../auth/AuthProvider'

const TONE = {
  TRIAL: ['bg-[#e8f0fd] border-[#1f5fd6]/30 text-[#1f5fd6]', 'clock', 'Choose a plan'],
  GRACE: ['bg-[#fbf1e1] border-[#8a5a12]/30 text-[#8a5a12]', 'alert', 'Renew plan'],
  EXPIRED: ['bg-[#fbebec] border-[#b4323c]/30 text-[#b4323c]', 'lock', 'Renew plan'],
}

export default function SubscriptionBanner({ className = '' }) {
  const auth = useAuth()
  const b = auth?.user?.subscription?.banner
  if (!b) return null
  const [tone, icon, cta] = TONE[b.tone] ?? TONE.TRIAL
  const advisor = auth.user.role === 'ADV'
  return (
    <div role="status" className={cx('mb-5 flex min-h-[62px] items-center gap-3 rounded-[18px] border px-4 py-2.5', tone, className)}>
      <Icon name={icon} size={16} className="shrink-0" />
      <p className="min-w-0 flex-1 text-[13px] font-bold">{b.message}{!advisor && ' Ask your advisor to renew.'}</p>
      {advisor && (
        <Link to="/settings/billing" className="flex h-9 shrink-0 items-center gap-2 rounded-[18px] bg-navy pr-3.5 pl-3 text-[13px] font-semibold text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700">
          <Icon name="arrow" size={16} />{cta}
        </Link>
      )}
    </div>
  )
}
