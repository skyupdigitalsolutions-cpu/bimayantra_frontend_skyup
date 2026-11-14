// Reusable domain cards from Figma › Components (Quick Tile, Renewal Card).
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { Avatar, InfoBox, RoundAction, cx } from './ui'

/** Figma: Quick Tile (Default / Hover / Active). 200×150, radius 26 */
export function QuickTile({ label, icon, to = '#', active = false }) {
  return (
    <Link
      to={to}
      className={cx(
        'group flex h-[150px] w-[200px] flex-col items-center justify-center gap-3.5 rounded-[26px] border transition',
        active
          ? 'border-[1.5px] border-pink-400 bg-pink-50 drop-shadow-[0px_14px_15px_rgba(232,137,156,0.14)]'
          : 'border-line-2 bg-white hover:border-pink-400 hover:bg-pink-50',
      )}
    >
      <span
        className={cx(
          'flex size-16 items-center justify-center rounded-full transition',
          active ? 'bg-navy text-white' : 'bg-tile text-ink group-hover:bg-navy group-hover:text-white',
        )}
      >
        <Icon name={icon} size={26} />
      </span>
      <span className="text-[14px] font-medium text-ink">{label}</span>
    </Link>
  )
}

/** Figma: Renewal Card. 232 wide, radius 30 */
export function RenewalCard({ r, to = '/renewals' }) {
  return (
    <Link
      to={to}
      className="flex w-full flex-col items-center overflow-hidden rounded-[24px] bg-white px-3 pt-4 pb-3 drop-shadow-[0px_8px_12px_rgba(19,41,75,0.05)] transition hover:-translate-y-0.5 hover:drop-shadow-[0px_14px_18px_rgba(19,41,75,0.1)] md:w-[232px] md:rounded-[30px] md:px-[18px] md:pt-6 md:pb-[22px]"
    >
      <Avatar initials={r.initials} tone={r.tone} size={60} ring className="text-[18px] max-md:!size-[44px] max-md:text-[14px]" />
      <p className="mt-2 text-center text-[13px] font-bold text-ink md:mt-3 md:text-[15px]">{r.name}</p>
      <p className="mt-0.5 text-center text-[11px] font-medium text-muted md:mt-1 md:text-[12px]">{r.insurer}</p>
      <div className="mt-2.5 flex w-full flex-col items-center gap-[3px] rounded-[12px] bg-pink-100 px-2 py-2 md:mt-3.5 md:rounded-[16px] md:px-0 md:py-3">
        <p className="text-center text-[11px] font-semibold text-ink md:text-[13px]">{r.plan}</p>
        <p className={cx('text-center text-[10px] font-medium md:text-[11px]', r.urgent ? 'text-rose' : 'text-slate')}>{r.due}</p>
      </div>
      <div className="mt-2 flex w-full gap-1.5 md:mt-2.5 md:gap-2">
        <InfoBox label="Renews" value={r.renews} className="max-md:px-2 max-md:py-2" />
        <InfoBox label="Premium" value={r.premium} className="max-md:px-2 max-md:py-2" />
      </div>
      <div className="mt-3 flex gap-2 md:mt-4 md:gap-2.5" onClick={(e) => e.preventDefault()}>
        <RoundAction icon="phone" aria-label="Call" className="max-md:!size-9" />
        <RoundAction icon="chat" aria-label="WhatsApp" className="max-md:!size-9" />
        <RoundAction icon="quote" aria-label="Quote" className="max-md:!size-9" />
      </div>
    </Link>
  )
}