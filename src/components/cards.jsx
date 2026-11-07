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
      className="flex w-[232px] flex-col items-center rounded-[30px] bg-white px-[18px] pt-6 pb-[22px] drop-shadow-[0px_8px_12px_rgba(19,41,75,0.05)] transition hover:-translate-y-0.5 hover:drop-shadow-[0px_14px_18px_rgba(19,41,75,0.1)]"
    >
      <Avatar initials={r.initials} tone={r.tone} size={60} ring className="text-[18px]" />
      <p className="mt-3 text-[15px] font-bold text-ink">{r.name}</p>
      <p className="mt-1 text-[12px] font-medium text-muted">{r.insurer}</p>
      <div className="mt-3.5 flex w-full flex-col items-center gap-[3px] rounded-[16px] bg-pink-100 py-3">
        <p className="text-[13px] font-semibold text-ink">{r.plan}</p>
        <p className={cx('text-[11px] font-medium', r.urgent ? 'text-rose' : 'text-slate')}>{r.due}</p>
      </div>
      <div className="mt-2.5 flex w-full gap-2">
        <InfoBox label="Renews" value={r.renews} />
        <InfoBox label="Premium" value={r.premium} />
      </div>
      <div className="mt-4 flex gap-2.5" onClick={(e) => e.preventDefault()}>
        <RoundAction icon="phone" aria-label="Call" />
        <RoundAction icon="chat" aria-label="WhatsApp" />
        <RoundAction icon="quote" aria-label="Quote" />
      </div>
    </Link>
  )
}