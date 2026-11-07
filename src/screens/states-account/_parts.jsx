// Shared parts for account / subscription states (A1–A9)
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { DashboardScreen } from '../tasks/_parts'

export const BILLING = '/x/17-settings-plan-and-billing'

/** Form field: 13px label + 50px panel input. */
export function AuthField({ label, leading, prefix, focus, className = '', ...rest }) {
  return (
    <label className={cx('flex w-[440px] flex-col gap-2', className)}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <span
        className={cx(
          'flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 focus-within:border-2 focus-within:border-blue focus-within:pl-[14px] focus-within:pr-[14px]',
          focus && 'border-2 border-blue px-[14px]',
        )}
      >
        {leading && <Icon name={leading} size={18} className="shrink-0 text-muted" />}
        {prefix && <span className={cx('text-[14px] font-semibold text-muted', focus && 'pl-0.5')}>{prefix}</span>}
        <input {...rest} className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none" />
      </span>
    </label>
  )
}

/** Inline note (wrong code / expired hint). */
export function Note({ icon, className = '', children }) {
  return (
    <div className={cx('flex items-center gap-2.5 rounded-[16px] px-4 py-3 text-[13px] font-semibold', className)}>
      <Icon name={icon} size={16} className="shrink-0" />
      {children}
    </div>
  )
}

const TONE = {
  trial: 'bg-[#e8f0fd] border-[#1f5fd6]/30 text-[#1f5fd6]',
  grace: 'bg-[#fbf1e1] border-[#8a5a12]/30 text-[#8a5a12]',
  expired: 'bg-[#fbebec] border-[#b4323c]/30 text-[#b4323c]',
}

/** Dashboard (5:27) with a subscription banner under the header (A7–A9). */
export function SubscriptionDashboard({ banner, readOnly = false }) {
  return (
    <div
      className={cx(
        'relative',
        // push quick actions below the 62px banner (16 above + 30 below)
        'xl:[&_main>div>:nth-child(3)]:mt-[78px]',
        readOnly && '[&_main>div>:nth-child(3)_a]:opacity-40 [&_main_header_a[href$=add-task-empty]]:opacity-40',
      )}
    >
      <DashboardScreen />
      <div
        className={cx(
          'absolute top-[138px] right-16 left-[196px] hidden h-[62px] items-center gap-3 rounded-[18px] border px-4 xl:flex',
          TONE[banner.tone],
        )}
      >
        <Icon name={banner.icon} size={16} className="shrink-0" />
        <p className="min-w-0 flex-1 text-[13px] font-bold">{banner.text}</p>
        <Link
          to={BILLING}
          className="flex h-9 shrink-0 items-center gap-2 rounded-[18px] bg-navy pr-3.5 pl-3 text-[13px] font-semibold text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700"
        >
          <Icon name="arrow" size={16} />
          {banner.cta}
        </Link>
      </div>
    </div>
  )
}
