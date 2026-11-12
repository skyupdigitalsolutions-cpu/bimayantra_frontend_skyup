// Shared layout for the customer-profile tab frames (05a–05i) and the family/documents flow (FD1–FD6):
// page heading + header actions, pink profile hero, profile tab bar, family tab body, drawer/modal shells.
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SChip, PillButton, Dot } from '../sales/_parts'
import { PANEL_SCRIM, DRAWER_BOX, DIALOG_MAX, useFitTop, useLockScroll } from '../sales/_overlay'
import { profile as P, profileTabs, members, newMember } from '../../data/customer-tabs'
import { useHeaderSearch, matches, NoMatches } from './_search'
import { api, useQuery } from '../../api'
import { daysFromToday } from '../../api/format'

export { SChip, PillButton, Dot }

export const CARD_SHADOW = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

/* ───────────── Header ───────────── */

function HeaderActions({ live }) {
  useHeaderSearch() // Ctrl/Cmd+K focuses the pill on every profile tab
  return (
    <div className="flex flex-wrap items-center gap-3 xl:shrink-0 xl:flex-nowrap">
      <label className="hidden h-[50px] w-[240px] items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px] shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)] md:flex">
        <Icon name="search" size={18} className="text-muted" />
        <input
          placeholder="Search anything"
          className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint"
        />
        <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
      </label>
      <button type="button" className="flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile">
        <Icon name="bell" size={18.5} />
      </button>
      {live?.actions}
      <PillButton variant="outline" icon="target" className="pl-[17px]" to={live?.bestFitTo ?? '/best-fit'}>Best fit</PillButton>
      {(!live || live.active) && <PillButton variant="pink" icon="quote" to={live?.quoteTo ?? '/quotations/new'}>New quotation</PillButton>}
    </div>
  )
}

function ProfileHero({ live }) {
  const P2 = live ?? P
  // The shared tab shell doesn't load renewals, so the hero's 3rd tile reads them here (live only).
  const rid = live?.raw?.id
  const renewals = useQuery(['renewals', rid], () => api.renewals.list({ customerId: rid }), { enabled: !!rid })
  const renewalMini = () => {
    const days = (renewals.data || [])
      .map((r) => (r.daysLeft != null ? r.daysLeft : daysFromToday(r.dueDate)))
      .filter((v) => v != null)
    return ['Renewal in', days.length ? `${Math.min(...days)} days` : '—']
  }
  // Keep tiles 1–2 from the view model; the 3rd tile is always "Renewal in / {N} days" per Figma.
  const minis = live ? [P2.minis[0], P2.minis[1], renewalMini()] : P2.minis
  return (
    <div className="mt-[13px] flex flex-wrap items-center gap-4 rounded-[32px] bg-linear-to-r from-[#fbd3dc] to-[#f6b3c3] px-5 py-5 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)] md:gap-[22px] md:px-[30px] md:py-[22px] xl:h-[120px] xl:flex-nowrap">
      <span className="flex size-[76px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-white text-[24px] font-bold text-navy">
        {P2.initials}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-[22px] font-bold tracking-[-0.2px] text-ink">{P2.name}</p>
        <p className="text-[13px] font-medium text-rose-ink">{P2.tagline}</p>
      </div>
      {minis.map(([k, v]) => (
        <div key={k} className="flex shrink-0 flex-col gap-0.5 rounded-[18px] bg-white/80 px-[18px] py-3">
          <p className="text-[12px] font-semibold whitespace-nowrap text-rose-ink">{k}</p>
          <p className="text-[18px] font-bold whitespace-nowrap text-ink">{v}</p>
        </div>
      ))}
    </div>
  )
}

/** Segmented pill tabs (white p5, tab px16 py9). items: [{key,label,count,to}] */
export function PillTabs({ items, value, onChange, className = '' }) {
  return (
    <div className={cx('flex w-max gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]', className)}>
      {items.map((t) => {
        const on = t.key === value
        const cls = cx(
          'flex h-[34px] items-center gap-2 rounded-[21px] px-4 text-[13px] font-semibold whitespace-nowrap transition',
          on ? 'bg-navy text-white' : 'text-slate hover:bg-panel hover:text-ink',
        )
        const inner = (
          <>
            {t.label}
            {t.count != null && (
              <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', on ? 'bg-white/20 text-white' : 'bg-panel text-muted')}>{t.count}</span>
            )}
          </>
        )
        if (t.to && !on) return <Link key={t.key} to={t.to} className={cls}>{inner}</Link>
        return <button key={t.key} type="button" onClick={() => onChange?.(t.key)} className={cls}>{inner}</button>
      })}
    </div>
  )
}

/**
 * Customer profile page frame.
 *  live: real customer from the API (connected pages) → { name, initials, meta, tagline, minis, active, tabs,
 *        quoteTo, bestFitTo, actions }. Without it the frame shows the design's mock customer.
 *  tab: active tab key · crumb: last breadcrumb segment · routes: per-frame ⇒ overrides {key: path}
 *  counts: per-frame count overrides {key: n} · overlay: scrim + drawer/modal rendered over the workspace
 */
export function ProfileShell({ tab, crumb, routes = {}, counts = {}, panelClass = '', overlay, children, live }) {
  const tabs = live ? live.tabs : profileTabs.map((t) => ({
    ...t,
    to: routes[t.key] ?? t.to,
    count: counts[t.key] ?? t.count,
  }))
  return (
    <AppLayout active="customers" panelClass={panelClass}>
      <header className="flex flex-col items-start gap-3 xl:flex-row xl:justify-between xl:gap-6">
        <div className="flex min-w-0 flex-col gap-1.5 xl:whitespace-nowrap">
          <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre-wrap xl:whitespace-pre text-muted uppercase">{`POLICY HOLDERS  /  ${(live?.name ?? 'Kavya Hegde').toUpperCase()}  /  ${crumb}`}</p>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">{live?.name ?? P.name}</h1>
            {!live || live.active ? <SChip tone="green" icon="check">Active</SChip> : <SChip tone="gray" icon="x">Inactive</SChip>}
          </div>
          <p className="text-[14px] font-medium text-muted">{live?.meta ?? P.meta}</p>
        </div>
        <div className="mt-1 max-w-full">
          <HeaderActions live={live} />
        </div>
      </header>

      <ProfileHero live={live} />

      <PillTabs className="mt-6" items={tabs} value={tab} />

      <div className="mt-6">{children}</div>

      {overlay}
    </AppLayout>
  )
}

/* ───────────── Small pieces ───────────── */

/** Card head: 17/bold title + optional 12/medium sub + right slot */
export function Head({ title, sub, right, className = '' }) {
  return (
    <div className={cx('flex w-full items-center gap-3', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] font-bold text-ink">{title}</p>
        {sub && <p className="text-[12px] font-medium text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

/** Inline note banner (r16, px16 py12, 13/semibold) */
export function Note({ icon, bg, color, className = '', children }) {
  return (
    <div className={cx('flex w-max items-center gap-2.5 rounded-[16px] px-4 py-3 text-[13px] font-semibold', className)} style={{ background: bg, color }}>
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </div>
  )
}

/** Round icon tile (bg tint, navy icon) */
export function IconTile({ icon, bg, size = 48, iconSize = 20, radius, className = '' }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center text-ink', className)}
      style={{ width: size, height: radius ? undefined : size, background: bg, borderRadius: radius ?? size / 2 }}
    >
      <Icon name={icon} size={iconSize} />
    </span>
  )
}

/** 36/34px chevron circle */
export function Chev({ size = 36, to, className = '' }) {
  const cls = cx('flex shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] transition group-hover:bg-navy group-hover:text-white', className)
  const inner = <Icon name="chev-right" size={size * 0.42} />
  if (to) return <Link to={to} className={cls} style={{ width: size, height: size }}>{inner}</Link>
  return <span className={cls} style={{ width: size, height: size }}>{inner}</span>
}

/* ───────────── Family tab body (05a / FD1–FD6) ───────────── */

function MemberCard({ m, links, selected, highlight, extraDocs = [] }) {
  const navigate = useNavigate()
  const go = links && m.to ? () => navigate(m.to) : undefined
  const docs = [...extraDocs, ...m.docs]
  return (
    <div
      onClick={go}
      className={cx(
        'flex w-[370px] flex-col gap-3.5 rounded-[28px] bg-white p-6',
        CARD_SHADOW,
        selected && 'border-2 border-blue',
        highlight && 'border-2 border-[#9cd8bd]',
        go && 'cursor-pointer transition hover:shadow-[0px_16px_30px_-10px_rgba(19,41,75,0.18)]',
      )}
    >
      <div className="flex items-center gap-3.5">
        <Dot initials={m.initials} bg={m.bg} size={52} font={17} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
          <p className="text-[15px] font-bold text-ink">{m.name}</p>
          <p className="text-[12px] font-medium text-muted">{m.rel}</p>
        </div>
        {links ? (
          <Link to="/customers" onClick={(e) => e.stopPropagation()} className="text-muted hover:text-ink" aria-label="Edit member">
            <Icon name="more" size={18} />
          </Link>
        ) : (
          <Icon name="more" size={18} className="text-muted" />
        )}
      </div>
      <div className="flex gap-2.5">
        {[['calendar', m.dob, m.dobWarn], ['phone', m.phone]].map(([icon, v, warn]) => (
          <div key={icon} className="flex h-[35px] flex-1 items-center gap-2 rounded-[14px] bg-panel px-3">
            <Icon name={icon} size={15} className="text-muted" />
            <span className={cx('text-[12px] font-semibold whitespace-nowrap', warn ? 'text-[#b4323c]' : 'text-ink')}>{v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="flex-1 text-[12px] font-bold text-muted">Documents</p>
          {links && m.addDocTo ? (
            <Link to={m.addDocTo} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[12px] font-bold text-blue hover:underline">
              <Icon name="plus" size={13} />Document
            </Link>
          ) : (
            <button type="button" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[12px] font-bold text-blue">
              <Icon name="plus" size={13} />Document
            </button>
          )}
        </div>
        {docs.length ? (
          <div className="flex flex-wrap gap-1.5">
            {docs.map((d) => <SChip key={d.label} tone={d.tone} icon={d.icon}>{d.label}</SChip>)}
          </div>
        ) : (
          <p className="text-[12px] font-medium text-faint">No documents yet</p>
        )}
      </div>
    </div>
  )
}

/**
 * Members grid + nominee / linked / actions column.
 *  links: wire the ⇒ targets of the base 05a frame (false under overlays)
 *  added: show the new Rohan card (FD2) · arjunSaved: Arjun selected with new Aadhaar (FD6)
 */
export function FamilyBody({ links = true, added = false, arjunSaved = false, addFamilyTo, addDocTo, query = '', onClearQuery }) {
  const L = (path) => (links ? path : undefined)
  const list = (added ? [...members, newMember] : members).filter((m) => matches(query, m.name, m.rel, m.phone, m.docs.map((d) => d.label)))
  return (
    <div className="flex items-start gap-5">
      <div className="flex w-[760px] flex-wrap items-start gap-5">
        {list.map((m) => (
          <MemberCard
            key={m.key}
            m={m}
            links={links}
            highlight={m.key === 'rohan'}
            selected={arjunSaved && m.key === 'arjun'}
            extraDocs={arjunSaved && m.key === 'arjun' ? [{ tone: 'amber', icon: 'alert', label: 'Aadhaar' }] : []}
          />
        ))}
        {!list.length && <NoMatches className="w-full bg-white" label={`No family members match “${query}”`} onClear={onClearQuery} />}
      </div>

      <div className="flex w-[400px] flex-col">
        <section className={cx('flex flex-col gap-3 rounded-[28px] bg-linear-to-r from-[#d4f1e7] to-[#b9e8d7] p-6', CARD_SHADOW)}>
          <Head title="Default nominee" right={<PillButton size="sm" className="px-3.5" to={L('/customers')}>Change</PillButton>} />
          <div className="flex items-center gap-3">
            <Dot initials="AH" bg="#ffffff" size={44} font={14} />
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <p className="text-[14px] font-bold text-ink">Arjun Hegde</p>
              <p className="text-[12px] font-medium text-[#2f6b55]">Spouse · 100%</p>
            </div>
          </div>
          <p className="text-[12px] font-medium text-[#2f6b55]">Suggested on new proposals only. Never changes a policy.</p>
        </section>

        <section className={cx('mt-[33px] flex flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="Linked customers" right={<PillButton size="sm" icon="link" to={L('/customers')}>Link</PillButton>} />
          <div className="flex w-max items-center gap-3 rounded-[16px] bg-panel p-3">
            <Dot initials="SR" bg="#e9e3fc" size={38} font={12} />
            <div className="flex flex-col gap-0.5 whitespace-nowrap">
              <p className="text-[13px] font-bold text-ink">Shanthi Rao</p>
              <p className="text-[12px] font-medium text-muted">Parent · CU-000322</p>
            </div>
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-2.5">
          <PillButton variant="pink" icon="user-plus" className="w-full justify-center" to={addFamilyTo ?? L('/customers')}>Add family member</PillButton>
          <PillButton variant="outline" icon="upload" className="w-full justify-center" to={addDocTo ?? L('/customers')}>Add document</PillButton>
        </div>
      </div>
    </div>
  )
}

/* ───────────── Overlays ───────────── */

export function Scrim({ onClick }) {
  useLockScroll()
  return <div data-overlay="scrim" onClick={onClick} className={cx(PANEL_SCRIM, 'z-40 bg-[#0e1f3b]/40')} />
}

/** Right drawer (Figma 500×928 at 736,24 in the workspace), viewport-fixed; content scrolls inside */
export function Drawer({ className = '', children }) {
  return (
    <div role="dialog" data-overlay="drawer" className={cx(DRAWER_BOX, 'z-50 flex w-[500px] flex-col gap-4 rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', className)}>
      {children}
    </div>
  )
}

/** Centered modal (Figma 760 wide at 250,80 in the workspace), viewport-fixed and kept on screen */
export function ModalBox({ className = '', children }) {
  const ref = useFitTop(80)
  return (
    <div ref={ref} role="dialog" data-overlay="dialog" style={{ top: 104 }} className={cx('fixed left-[406px] z-50 flex w-[760px] flex-col gap-[18px] rounded-[32px] bg-white p-7 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', DIALOG_MAX, className)}>
      {children}
    </div>
  )
}

/** Overlay title row with close button */
export function OverlayHead({ title, sub, closeTo, lead }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3">
      {lead}
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">{title}</p>
        <p className="text-[12px] font-medium text-muted">{sub}</p>
      </div>
      <button
        type="button"
        onClick={() => (closeTo ? navigate(closeTo) : navigate(-1))}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink hover:bg-chip"
        aria-label="Close"
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  )
}