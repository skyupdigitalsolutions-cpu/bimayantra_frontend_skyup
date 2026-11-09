// Shared structure for the Settings section (Figma 13:1595 › "Settings nav" + layout)
import { Link, NavLink } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, cx } from '../../components/ui'
import { SelectCompat } from '../../components/pickers'
import { useHeaderSearch } from '../admin/_filter'

// Paths are the connected settings pages (src/live/Settings.jsx); the Figma frames open with ?proto=1.
export const SETTINGS_NAV = [
  { label: 'My profile', icon: 'user-plus', to: '/settings' },
  { label: 'KYC', icon: 'shield', to: '/settings/kyc' },
  { label: 'My insurers', icon: 'box', to: '/settings/insurers' },
  { label: 'My plan and billing', icon: 'card', to: '/settings/billing' },
  { label: 'WhatsApp wallet', icon: 'wallet', to: '/settings/wallet' },
  { label: 'Assistants', icon: 'users', to: '/settings/assistants' },
  { label: 'Referrers', icon: 'link', to: '/settings/referrers' },
  { label: 'Support access', icon: 'eye', to: '/settings/support' },
  { label: 'Export my data', icon: 'download', to: '/settings/export' },
  { label: 'Activity log', icon: 'list', to: '/settings/activity' },
  { label: 'Security', icon: 'lock', to: '/settings/security' },
]

export function SettingsNav() {
  return (
    <nav className="flex w-[260px] shrink-0 flex-col gap-[2px] self-start rounded-[28px] bg-white p-2.5 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      {SETTINGS_NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end
          className={({ isActive }) =>
            cx(
              'flex items-center gap-3 rounded-[16px] px-3.5 py-[11px] text-[13px] font-semibold whitespace-nowrap',
              isActive ? 'bg-navy text-white' : 'text-ink-2 hover:bg-panel',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={n.icon} size={18} className={isActive ? 'text-white' : 'text-muted'} />
              {n.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/** PageHeader + left settings nav + 900px content column (top 140, left 320 in the frame).
 *  onSearch(text) — called as the header search pill is typed in (filter the page's list). */
export function SettingsLayout({ breadcrumb, title, titleExtra, subtitle, actions, children, contentClass = 'gap-3.5', onSearch }) {
  // Header "Search anything" pill: Ctrl/Cmd+K focuses it; pages with a list pass onSearch to filter it.
  useHeaderSearch(onSearch)
  return (
    <AppLayout active="settings">
      <PageHeader breadcrumb={breadcrumb} title={title} titleExtra={titleExtra} subtitle={subtitle} actions={actions} className="min-h-[83px]" />
      <div className="mt-[21px] flex items-start gap-5">
        <SettingsNav />
        <div className={cx('flex w-[900px] flex-col', contentClass)}>{children}</div>
      </div>
    </AppLayout>
  )
}

/** Section card: white r28 px24 py20, gap 12 */
export function SCard({ className = '', children }) {
  return (
    <section className={cx('flex flex-col gap-3 rounded-[28px] bg-white px-6 py-5 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]', className)}>
      {children}
    </section>
  )
}

/** Select on #f4f6fb with the muted chevron used throughout Settings. */
export function MutedSelect({ options = [], className = '', ...rest }) {
  return (
    <SelectCompat options={options.map((o) => ({ value: o.value ?? o, label: o.label ?? String(o) }))} className={className} {...rest} />
  )
}

/** Card head row: title 17/bold + sub 12/medium + right slot */
export function SHead({ title, subtitle, right }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] font-bold text-ink">{title}</p>
        {subtitle && <p className="text-[12px] font-medium text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

/** Navy / white pill buttons (h36 r18 or h46 r24) */
export function SBtn({ variant = 'navy', icon, size = 'sm', to, className = '', children, ...rest }) {
  const v = {
    navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]',
    white: 'bg-white text-ink border border-line',
    pink: 'bg-linear-to-b from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]',
    danger: 'bg-white text-[#c0282d] border border-[#f3c9c9]',
  }[variant]
  const s = size === 'sm' ? 'h-9 rounded-[18px] pr-3.5 pl-3 text-[13px] gap-2' : 'h-[46px] rounded-[24px] pr-5 pl-4 text-[14px] gap-2'
  const cls = cx('inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap', s, v, className)
  const inner = <>{icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}{children}</>
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  return <button type="button" className={cls} {...rest}>{inner}</button>
}

/** Uploaded-document tile (KYC): tinted r20, white icon disc, eye button */
export function DocTile({ bg, icon, title, sub, className = '' }) {
  return (
    <div className={cx('flex flex-1 items-center gap-3.5 rounded-[20px] p-4', bg, className)}>
      <span className="flex size-11 items-center justify-center rounded-full bg-white/80">
        <Icon name={icon} size={20} className="text-ink" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[14px] font-bold text-ink">{title}</p>
        <p className="text-[12px] font-medium text-slate">{sub}</p>
      </div>
      <button type="button" className="flex size-[34px] items-center justify-center rounded-full bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
        <Icon name="eye" size={14.3} className="text-ink" />
      </button>
    </div>
  )
}

const SCHIP = {
  green: 'bg-[#e7f4ee] text-[#127650]',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  red: 'bg-[#fbebec] text-[#b4323c]',
  blue: 'bg-blue-50 text-blue',
  violet: 'bg-violet-50 text-violet',
  gray: 'bg-[#eef1f5] text-ink-2',
}
/** Status chip h25 r14 with 13px icon */
export function SChip({ tone = 'gray', icon, className = '', children }) {
  return (
    <span className={cx('inline-flex shrink-0 items-center gap-[5px] rounded-[14px] py-[5px] pr-3 text-[12px] font-semibold whitespace-nowrap', icon ? 'pl-2' : 'pl-3', SCHIP[tone], className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** Blue info note r16 */
export function SNote({ icon = 'alert', className = '', children }) {
  return (
    <div className={cx('flex w-fit items-center gap-2.5 rounded-[16px] bg-blue-50 px-4 py-3 text-[13px] font-semibold text-blue', className)}>
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </div>
  )
}