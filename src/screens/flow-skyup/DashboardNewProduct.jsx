// Figma 129:15302 · 01b · Dashboard — New product from SkyUp
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { QuickTile, RenewalCard } from '../../components/cards'
import { dashQuick, dashRenewals, notifications } from '../../data/flow-skyup'
import { useHeaderSearch, clearHeaderSearch, matches, NoMatches } from '../admin/_filter'

const SH = 'shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]'

function QuickActions() {
  return (
    <section className="mt-5 -mr-1 w-[416px] shrink-0">
      <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">What do you need?</h1>
      <p className="mt-1.5 text-[14px] font-medium text-muted">Start any task in one tap</p>
      <div className="mt-[26px] flex flex-wrap gap-x-4 gap-y-3.5">
        {dashQuick.map((q) => (
          <QuickTile key={q.label} label={q.label} icon={q.icon} to={q.to} active={q.active} />
        ))}
      </div>
    </section>
  )
}

/** Small square type tile (Health / Motor / Travel / Compare) */
function TypeTile({ to, icon, label, sub, className }) {
  return (
    <Link to={to} className={cx('absolute flex h-[118px] flex-col items-center justify-center gap-2.5 rounded-[26px]', className)}>
      <Icon name={icon} size={30} className="text-ink" />
      <span className="text-[14px] font-semibold text-ink">{label}</span>
      <span className="text-[11px] font-medium text-muted">{sub}</span>
    </Link>
  )
}

/** Wide tile with icon + two lines (+ optional go button) */
function WideTile({ to, icon, iconClass = 'text-ink', iconSize = 30, title, sub, go, className }) {
  return (
    <Link to={to} className={cx('absolute flex items-center gap-3.5 rounded-[26px] pr-5 pl-6', className)}>
      <Icon name={icon} size={iconSize} className={iconClass} />
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="text-[15px] font-semibold text-ink">{title}</span>
        <span className="text-[12px] font-medium whitespace-nowrap text-muted">{sub}</span>
      </span>
      {go && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/80">
          <Icon name="arrow" size={16} className="text-ink" />
        </span>
      )}
    </Link>
  )
}

export default function DashboardNewProduct() {
  const [open, setOpen] = useState(true)
  const [read, setRead] = useState(false)
  // Header search narrows the page's list (Renewals due)
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const renewals = dashRenewals.filter((r) => matches(q, r.name, r.insurer, r.plan, r.due, r.renews))
  return (
    <AppLayout active="dashboard" aside={<QuickActions />} panelClass="pb-[13px]">
      <div className="relative">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[30px] font-bold tracking-[-0.6px] text-ink">Insurance catalogue</h2>
          <p className="text-[14px] font-medium text-muted">Rank, compare and quote products you can sell.</p>
        </div>
        <label className={cx('absolute top-1 left-[380px] flex h-[50px] w-[268px] items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px]', SH)}>
          <Icon name="search" size={18} className="text-muted" />
          <input placeholder="Search anything" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
          <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
        </label>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setOpen(!open)}
          className={cx('absolute top-1 left-[660px] flex size-[50px] items-center justify-center rounded-full bg-white', SH)}
        >
          <Icon name="bell" size={20} className="text-ink" />
          {!read && <span className="absolute top-[11px] left-[31px] size-[9px] rounded-full border-2 border-white bg-[#e5484d]" />}
        </button>
      </div>

      {/* Catalogue tiles (absolute, as laid out in the frame) */}
      <div className="relative mt-[34px] h-[360px]">
        <TypeTile to="/products" icon="heart" label="Health" sub="5 products" className="top-0 left-0 w-[118px] bg-[#fde8c9]" />
        <Link to="/x/10e-products-new-from-skyup" className="absolute top-2 left-[60px] z-10 rounded-[10px] bg-[#b4325a] px-2 py-[3px] text-[10px] font-bold text-white">+1 new</Link>
        <TypeTile to="/products" icon="car" label="Motor" sub="1 product" className="top-[132px] left-0 w-[118px] bg-[#d9eafd]" />
        <Link
          to="/best-fit"
          className="absolute top-0 left-[132px] flex h-[250px] w-[196px] flex-col items-center justify-center rounded-[30px] bg-pink-hero shadow-[0px_18px_36px_-10px_rgba(232,137,156,0.3)]"
        >
          <span className="flex size-[86px] items-center justify-center rounded-full border-4 border-white bg-linear-to-b from-white to-[#fdeff2] text-[26px] font-extrabold text-navy shadow-[0px_8px_18px_-4px_rgba(194,65,90,0.2)]">KH</span>
          <span className="mt-3.5 text-[15px] font-bold text-ink">Kavya Hegde</span>
          <span className="mt-1 text-[11px] font-medium text-rose-ink">Best fit · CareFirst Family</span>
          <span className="mt-3 flex items-center gap-1.5 rounded-[14px] bg-white/80 py-1.5 pr-3 pl-3.5 text-[12px] font-bold text-ink">
            <Icon name="sparkle" size={14} className="text-rose" />Score 89
          </span>
        </Link>
        <WideTile to="/products" icon="umbrella" iconSize={34} title="Life and Term" sub="Term and savings plans" className="top-0 left-[332px] h-[118px] w-[268px] bg-violet-100" />
        <TypeTile to="/products" icon="plane" label="Travel" sub="Coming soon" className="top-0 left-[614px] w-[126px] bg-[#d4f1e7]" />
        <TypeTile to="/x/10b-products-compare-variants" icon="compare" label="Compare" sub="2–3 products" className="top-[132px] left-[332px] w-[152px] border border-line bg-white" />
        <WideTile to="/products" icon="box" title="My products" sub="1 own · private to you" className="top-[132px] left-[498px] h-[118px] w-[242px] bg-pink-100" />
        <WideTile to="/best-fit" icon="sparkle" iconClass="text-violet" title="Run Best fit" sub="Rank products with reasons" go className="top-[264px] left-0 h-24 w-[322px] bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb]" />
        <WideTile to="/products" icon="shield" iconClass="text-[#127650]" title="Verified by SkyUp" sub="9 products · 5 insurers · updated 01-10-2026" go className="top-[264px] left-[332px] h-24 w-[408px] border border-line bg-white" />
      </div>

      <div className="mt-10 flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[30px] font-bold tracking-[-0.6px] text-ink">Renewals due</h2>
          <p className="text-[14px] font-medium text-muted">Upcoming renewals, soonest first.</p>
        </div>
        <Link to="/renewals" className={cx('mt-3 mr-1 flex h-9 items-center gap-2 rounded-[20px] bg-white pr-3 pl-4 text-[13px] font-semibold text-ink', SH)}>
          View all<Icon name="arrow" size={16} />
        </Link>
      </div>
      <div className="mt-[22px] flex gap-5">
        {renewals.map((r) => <RenewalCard key={r.name} r={r} to="/x/n1-renewal-detail" />)}
        {renewals.length === 0 && (
          <NoMatches
            className="w-full bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]"
            hint={`No renewals match “${q}”.`}
            onClear={() => { clearHeaderSearch(); setQ('') }}
          />
        )}
      </div>

      {open && (
        <div className="absolute top-[100px] left-[350px] z-30 flex w-[400px] flex-col gap-1.5 rounded-[28px] bg-white p-4 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]">
          <div className="flex items-center gap-2.5 px-1.5 pt-1 pb-2">
            <p className="flex-1 text-[16px] font-bold text-ink">Notifications</p>
            <Link to="/notifications" onClick={() => setRead(true)} className="text-[12px] font-bold text-blue">Mark all read</Link>
          </div>
          {notifications.map((n) => {
            const Tag = n.to ? Link : 'div'
            return (
              <Tag key={n.title} to={n.to} className={cx('relative flex gap-3 rounded-[16px] p-3', n.unread && !read && 'bg-[#f7f9ff]')}>
                <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-full', n.tint)}>
                  <Icon name={n.icon} size={18} className="text-ink" />
                </span>
                <span className="flex w-[280px] flex-col gap-[3px]">
                  <span className="text-[13px] font-bold text-ink">{n.title}</span>
                  {n.body && <span className="text-[12px] leading-[17px] font-medium text-muted">{n.body}</span>}
                  <span className="text-[11px] font-semibold text-muted">{n.time}</span>
                </span>
                {n.unread && !read && <span className="absolute top-3 right-3 size-2 rounded-full bg-blue" />}
              </Tag>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}