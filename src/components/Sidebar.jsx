import { NavLink, Link } from 'react-router-dom'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Icon from './Icon'
import logo from '../assets/logo.svg'
import { useAuth } from '../auth/AuthProvider'
import { initials as initialsOf } from '../api/format'

// Figma: Components › Sidebar (37:3060). Order and targets follow the prototype links.
export const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid', to: '/' },
  { key: 'leads', label: 'Leads', icon: 'columns', to: '/leads' },
  { key: 'campaigns', label: 'Campaigns', icon: 'chart', to: '/campaigns' },
  { key: 'customers', label: 'Policy Holders', icon: 'users', to: '/customers' },
  { key: 'products', label: 'Products', icon: 'box', to: '/products' },
  { key: 'bestfit', label: 'Best fit', icon: 'target', to: '/best-fit' },
  { key: 'quotations', label: 'Quotations', icon: 'quote', to: '/quotations' },
  { key: 'proposals', label: 'Proposals', icon: 'send', to: '/proposals' },
  { key: 'policies', label: 'Policies', icon: 'shield', to: '/policies' },
  { key: 'renewals', label: 'Renewals', icon: 'refresh', to: '/renewals' },
  { key: 'communications', label: 'Communications', icon: 'chat', to: '/communications' },
  { key: 'settings', label: 'Settings', icon: 'settings', to: '/settings' },
]

/* ───────────── Responsive navigation (Figma R1 tablet / R2–R5 mobile) ─────────────
 * Only used by AppLayout when `responsive` is on; the desktop Sidebar below is unchanged. */

/** R1 · 72px icon rail for tablet widths (768–1279). */
export function TabletRail({ active, items = NAV, home = '/' }) {
  const { ref, more, scrollBy } = useScrollableNav(active)
  return (
    <nav className="relative flex h-[min(1180px,calc(100vh-32px))] min-h-[420px] w-[72px] shrink-0 flex-col items-center rounded-[36px] bg-rail pt-4 pb-6">
      <Link to={home} aria-label="Bimayantra home" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">
        <img src={logo} alt="" width={24} height={24} />
      </Link>
      <div className="relative mt-[26px] flex min-h-0 flex-col">
      <NavArrow dir={-1} show={more.up} onClick={() => scrollBy(-1)} inset="-inset-x-3" />
      <ul ref={ref} className="flex min-h-0 flex-col gap-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.filter((item) => item.key !== 'campaigns').map((item) => {
          const on = item.key === active
          return (
            <li key={item.key} data-active={on || undefined}>
              <NavLink
                to={item.to}
                title={item.label}
                aria-label={item.label}
                className={`flex size-11 items-center justify-center rounded-full transition-colors ${on ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <Icon name={item.icon} size={20} className={`[&_path]:[vector-effect:non-scaling-stroke] ${on ? 'text-white' : 'text-white/60'}`} />
              </NavLink>
            </li>
          )
        })}
      </ul>
      <NavArrow dir={1} show={more.down} onClick={() => scrollBy(1)} inset="-inset-x-3" />
      </div>
    </nav>
  )
}

/** R2/R4/R5 · white app bar (logo or back button, title, search + bell). */
export function MobileAppBar({ title, back, actions = true, search = true }) {
  const btn = 'flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'
  return (
    <header className="sticky top-0 z-30 flex h-[100px] shrink-0 items-center gap-2.5 bg-white px-4 pt-[52px] pb-3">
      {back ? (
        <Link to={back} aria-label="Back" className={btn}>
          <Icon name="arrow" size={15.1} className="[&_path]:[vector-effect:non-scaling-stroke] rotate-180 text-ink" />
        </Link>
      ) : (
        <Link to="/" aria-label="Bimayantra home" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy">
          <img src={logo} alt="" width={18} height={18} />
        </Link>
      )}
      <p className="min-w-0 flex-1 text-[17px] font-bold text-ink">{title}</p>
      {actions && (
        <>
          {search && <button type="button" aria-label="Search" className={btn}><Icon name="search" size={15.1} className="[&_path]:[vector-effect:non-scaling-stroke] text-ink" /></button>}
          <Link to="/notifications" aria-label="Notifications" className={btn}><Icon name="bell" size={15.1} className="[&_path]:[vector-effect:non-scaling-stroke] text-ink" /></Link>
        </>
      )}
    </header>
  )
}

export const MOBILE_TABS = [
  { key: 'dashboard', label: 'Home', icon: 'grid', to: '/' },
  { key: 'leads', label: 'Leads', icon: 'columns', to: '/leads/list' },
  { key: 'customers', label: 'Policy holders', icon: 'users', to: '/customers' },
  { key: 'quotations', label: 'Quotes', icon: 'quote', to: '/quotations' },
  { key: 'more', label: 'More', icon: 'menu', to: '/settings' },
]

/** R2/R4 · fixed bottom tab bar. */
export function MobileTabBar({ active }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[81px] bg-white px-2 pt-2.5 pb-[26px] shadow-[0px_-4px_20px_-6px_rgba(19,41,75,0.1)]">
      {MOBILE_TABS.map((t) => {
        const on = t.key === active
        return (
          <Link key={t.key} to={t.to} className="flex flex-1 flex-col items-center gap-1">
            <span className={`flex h-7 w-12 items-center justify-center rounded-[14px] ${on ? 'bg-[#e8f0fd]' : ''}`}>
              <Icon name={t.icon} size={20} className={`[&_path]:[vector-effect:non-scaling-stroke] ${on ? 'text-[#1f5fd6]' : 'text-[#7a8699]'}`} />
            </span>
            <span className={`text-[10px] whitespace-nowrap ${on ? 'font-bold text-[#1f5fd6]' : 'font-semibold text-[#7a8699]'}`}>{t.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/**
 * Left rail. `active` = NAV key to highlight.
 * `items` lets other shells (admin, referrer) supply their own nav; `home` sets the logo link.
 */
/* ───────────── Scrollable nav list ─────────────
 * On short screens the rail can't fit every item. This keeps the list's scroll
 * position across page changes, brings the active page's item into view, and shows
 * up/down arrow buttons whenever there are more items above or below. */
let savedScroll = 0

function useScrollableNav(active) {
  const ref = useRef(null)
  const [more, setMore] = useState({ up: false, down: false })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    setMore({ up: el.scrollTop > 2, down: el.scrollTop + el.clientHeight < el.scrollHeight - 2 })
    savedScroll = el.scrollTop
  }, [])

  // Restore the previous position, then make sure the active item is fully visible.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = savedScroll
    const item = el.querySelector('[data-active="true"]')
    if (item) {
      const top = item.offsetTop - el.offsetTop
      const pad = 36 // keep clear of the arrow buttons
      if (top - pad < el.scrollTop) el.scrollTop = Math.max(0, top - pad)
      else if (top + item.offsetHeight + pad > el.scrollTop + el.clientHeight) el.scrollTop = top + item.offsetHeight + pad - el.clientHeight
    }
    measure()
  }, [active, measure])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    return () => { ro.disconnect(); el.removeEventListener('scroll', measure) }
  }, [measure])

  const scrollBy = (dir) => ref.current?.scrollBy({ top: dir * 162, behavior: 'smooth' })
  return { ref, more, scrollBy }
}

function NavArrow({ dir, onClick, show, inset = 'inset-x-0' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'More pages above' : 'More pages below'}
      tabIndex={show ? 0 : -1}
      className={`absolute ${inset} z-10 flex h-9 items-center justify-center text-white transition-opacity duration-200 ${
        dir < 0 ? 'top-0 bg-linear-to-b' : 'bottom-0 bg-linear-to-t'
      } from-[#16305a] via-[#16305a]/90 to-transparent ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <span className={`flex size-6 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 ${show && dir > 0 ? 'animate-bounce' : ''}`}>
        <Icon name="chev-down" size={16} strokeWidth={2} className={dir < 0 ? 'rotate-180' : ''} />
      </span>
    </button>
  )
}

export default function Sidebar({ active, items = NAV, initials, home = '/' }) {
  const { ref, more, scrollBy } = useScrollableNav(active)
  const auth = useAuth()
  // Signed-in user's initials; 'SR' only on prototype frames shown without a session.
  const shownInitials = initials ?? (auth?.user?.name ? initialsOf(auth.user.name) : 'SR')
  return (
    <aside className="flex w-[100px] shrink-0 flex-col items-center gap-4">
      <Link
        to={home}
        className="flex size-[84px] items-center justify-center rounded-[42px] bg-navy shadow-[0px_14px_30px_-8px_rgba(19,41,75,0.3)]"
        aria-label="Bimayantra home"
      >
        <img src={logo} alt="" width={40} height={40} />
      </Link>

      {/* 868px per Figma; shrinks on short viewports — the list then scrolls, with arrows showing there's more */}
      <nav className="relative flex h-[min(868px,calc(100vh-156px))] min-h-[420px] w-[100px] flex-col items-center rounded-[44px] bg-rail pt-7 pb-[34px] shadow-[0px_20px_40px_-10px_rgba(19,41,75,0.2)]">
        <div className="relative flex min-h-0 flex-col">
          <NavArrow dir={-1} show={more.up} onClick={() => scrollBy(-1)} />
          <ul ref={ref} className="flex min-h-0 flex-col gap-1 overflow-y-auto px-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item) => {
              const isActive = item.key === active
              return (
                <li key={item.key} className="relative" data-active={isActive || undefined}>
                  {isActive && <span className="absolute top-[14px] -left-[6px] h-[22px] w-[3px] rounded-[2px] bg-pink-300" />}
                  <NavLink
                    to={item.to}
                    className={`flex h-[50px] w-[84px] flex-col items-center justify-center gap-[5px] rounded-[16px] px-1 py-1.5 text-center text-[10px] transition-colors ${
                      isActive ? 'bg-white/10 font-bold text-white' : 'font-semibold text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon name={item.icon} size={20} className={isActive ? 'text-white' : 'text-white/60'} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
          <NavArrow dir={1} show={more.down} onClick={() => scrollBy(1)} />
        </div>

        <div className="mt-auto flex shrink-0 flex-col items-center gap-5 pt-4">
          <div className="flex size-[48px] items-center justify-center rounded-[24px] border-2 border-white bg-pink-200 text-[15px] font-bold text-navy">
            {shownInitials}
          </div>
          {auth?.user ? (
            <button type="button" onClick={auth.logout} aria-label="Log out" className="text-white/60 hover:text-white">
              <Icon name="logout" size={22} />
            </button>
          ) : (
            <Link to="/login" aria-label="Log out" className="text-white/60 hover:text-white">
              <Icon name="logout" size={22} />
            </Link>
          )}
        </div>
      </nav>
    </aside>
  )
}