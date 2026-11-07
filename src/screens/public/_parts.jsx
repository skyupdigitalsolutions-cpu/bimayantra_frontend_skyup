// Shared pieces for public (non-advisor-shell) pages: customer quotation, referral form, referrer dashboard.
import { Link, NavLink } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import logo from '../../assets/logo.svg'
export { SBtn, SChip } from '../settings/_parts'

/** 1440-wide canvas with a blurred colour blob, like the Figma public frames. */
export function PublicPage({ bg = 'bg-panel', blob, className = '', children }) {
  return (
    <div className={cx('min-h-screen overflow-hidden', bg)}>
      <div className={cx('relative mx-auto min-h-[1024px] w-[1440px]', className)}>
        {blob && (
          <span
            className="pointer-events-none absolute rounded-full blur-[90px]"
            style={{ left: blob.x, top: blob.y, width: blob.size, height: blob.size, background: blob.color }}
          />
        )}
        {children}
      </div>
    </div>
  )
}

/** Avatar with white ring (initials on a tint) */
export function RingAvatar({ ini, bg = '#fbd5dd', size = 48, text = 15, className = '' }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-full border-2 border-white font-bold text-navy', className)}
      style={{ width: size, height: size, background: bg, fontSize: text }}
    >
      {ini}
    </span>
  )
}

export const cardShadow = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

/** Referrer shell: 84px logo + 84px rail (link / lock), workspace panel 1260 wide. */
export function ReferrerShell({ children }) {
  const items = [
    { icon: 'link', to: '/referrer' },
    { icon: 'lock', to: null },
  ]
  return (
    <div className="flex min-h-screen min-w-[1280px] gap-11 bg-white py-6 pr-6 pl-7">
      <aside className="sticky top-7 flex h-fit w-[84px] shrink-0 flex-col gap-4 self-start">
        <Link to="/referrer" className="flex size-[84px] items-center justify-center rounded-full bg-navy shadow-[0px_14px_30px_-8px_rgba(19,41,75,0.3)]">
          <img src={logo} alt="" width={40} height={40} />
        </Link>
        <nav className="relative flex h-[868px] w-[84px] flex-col items-center rounded-[42px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] pt-[30px] pb-[28px] shadow-[0px_20px_40px_-10px_rgba(19,41,75,0.2)]">
          {items.map((it, i) =>
            it.to ? (
              <NavLink key={i} to={it.to} end className="relative flex size-[52px] items-center justify-center rounded-full bg-white/10">
                <span className="absolute top-[23px] -left-[11px] size-1.5 rounded-full bg-[#f7b9c4]" />
                <Icon name={it.icon} size={24} className="text-white" />
              </NavLink>
            ) : (
              <span key={i} className="mt-8 flex size-6 items-center justify-center">
                <Icon name={it.icon} size={24} className="text-white/60" />
              </span>
            ),
          )}
          <div className="mt-auto flex flex-col items-center gap-5">
            <RingAvatar ini="MK" bg="#fde8c9" />
            <Link to="/login" aria-label="Log out"><Icon name="logout" size={24} className="text-white/60" /></Link>
          </div>
        </nav>
      </aside>
      <main className="relative min-h-[976px] flex-1 rounded-[40px] bg-panel px-10 pt-9 pb-10">{children}</main>
    </div>
  )
}
